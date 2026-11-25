import { computed, WritableSignal } from '@angular/core';
import {
  CHARACTERS_BY_ID,
  ELDER,
  HEALER,
  HOODRAT,
  KNIGHT,
  SMALL_CHILD,
  WEREWOLF,
  WITCH,
} from '../../models/characters';
import { isWerewolf, WerewolfCharacter } from '../../models/werewolf-character';
import {
  ChangeCause,
  ChangeReason,
  Connection,
  ConnectionType,
  DaybreakChange,
  findConnection,
  hasStatus,
  isAlive,
  PersonStatus,
  State,
  VictimMark,
} from './types';

const STATUS_BY_REASON: Partial<Record<ChangeReason, PersonStatus>> = {
  [ChangeReason.DiedGotKilled]: PersonStatus.Dead,
  [ChangeReason.DiedSleptWithVictim]: PersonStatus.Dead,
  [ChangeReason.DiedOfBrokenHeart]: PersonStatus.Dead,
  [ChangeReason.TurnedIntoWolf]: PersonStatus.TurnedWolf,
  [ChangeReason.WoundedByTheKnight]: PersonStatus.Wounded,
};

export class DaybreakState {
  constructor(private state: WritableSignal<State>) {}

  readonly changes = computed<readonly DaybreakChange[]>(() => resolveDaybreak(this.state()));
  readonly pending = computed<readonly DaybreakChange[]>(() => pendingChanges(this.state()));

  isApplied(change: DaybreakChange) {
    return includesChange(this.state().appliedChanges, change);
  }

  apply(change: DaybreakChange) {
    this.state.update((state) => applyChange(state, change));
  }

  applyAll() {
    for (const change of this.pending()) {
      this.apply(change);
    }
  }
}

export function isAppliable(change: DaybreakChange) {
  return STATUS_BY_REASON[change.reason] !== undefined;
}

export function pendingChanges(state: State): DaybreakChange[] {
  return resolveDaybreak(state).filter(
    (change) => isAppliable(change) && !includesChange(state.appliedChanges, change),
  );
}

export function resolveDaybreak(state: State): DaybreakChange[] {
  const morning = new Morning(
    aliveAtDawn(state),
    findConnection(state.connections, ConnectionType.Love),
  );
  const sleepover = findConnection(state.connections, ConnectionType.Sleepover);

  for (const personId of new Set(state.victims.map((mark) => mark.personId))) {
    resolveAttack(state, morning, personId, sleepover);
  }
  resolveDueWounds(state, morning);
  resolveRoleModel(state, morning);
  resolveHostDeath(morning, sleepover);
  morning.changes.push(...knightWoundChanges(state, morning));

  return morning.toChanges();
}

export function woundChange(personId: string): DaybreakChange {
  return { personId, reason: ChangeReason.WoundedByTheKnight, causedBy: { role: KNIGHT.id } };
}

export function isWoundedThisMorning(state: State, personId: string) {
  return wasAppliedThisMorning(state, personId, ChangeReason.WoundedByTheKnight);
}

export function isPersonDead(change: DaybreakChange) {
  return STATUS_BY_REASON[change.reason] === PersonStatus.Dead;
}

export function applyChange(state: State, change: DaybreakChange): State {
  if (includesChange(state.appliedChanges, change)) {
    return state;
  }
  const status = STATUS_BY_REASON[change.reason];

  return {
    ...state,
    appliedChanges: [...state.appliedChanges, change],
    people: state.people.map((person) =>
      status && person.id === change.personId && !hasStatus(person, status)
        ? { ...person, statuses: [...person.statuses, status] }
        : person,
    ),
  };
}

class Morning {
  readonly changes: DaybreakChange[] = [];
  readonly dying = new Set<string>();
  readonly raided = new Set<string>();

  constructor(
    private readonly alive: ReadonlySet<string>,
    private readonly love: Connection | undefined,
  ) {}

  die(personId: string, reason: ChangeReason, causedBy: ChangeCause) {
    if (!this.alive.has(personId) || this.dying.has(personId)) {
      return;
    }
    this.dying.add(personId);
    this.changes.push({ personId, reason, causedBy });

    const partner = partnerOf(this.love, personId);
    if (partner) {
      this.die(partner, ChangeReason.DiedOfBrokenHeart, { person: personId });
    }
  }

  survive(personId: string, savedBy: string) {
    const isReported = this.changes.some(
      (change) => change.personId === personId && change.reason === ChangeReason.SurvivedAttack,
    );
    if (this.alive.has(personId) && !isReported) {
      this.changes.push({
        personId,
        reason: ChangeReason.SurvivedAttack,
        causedBy: { role: savedBy },
      });
    }
  }

  isLiving(personId: string) {
    return this.alive.has(personId) && !this.dying.has(personId);
  }

  toChanges(): DaybreakChange[] {
    return this.changes.filter(
      (change) => change.reason !== ChangeReason.SurvivedAttack || !this.dying.has(change.personId),
    );
  }
}

interface Raid {
  lands: boolean;
  keptOutBy?: string;
  sparedBy?: string;
}

function aliveAtDawn(state: State) {
  const diedThisMorning = (personId: string) =>
    state.appliedChanges.some((change) => change.personId === personId && isPersonDead(change));
  return new Set(
    state.people
      .filter((person) => isAlive(person) || diedThisMorning(person.id))
      .map((person) => person.id),
  );
}

function resolveAttack(
  state: State,
  morning: Morning,
  personId: string,
  sleepover: Connection | undefined,
) {
  const marks = state.victims.filter((mark) => mark.personId === personId);
  const raid = raidOn(state, personId, marks, sleepover);
  const lethal = marks.filter((mark) => !isByWolves(mark) || (raid.lands && !raid.sparedBy));

  if (raid.lands) {
    morning.raided.add(personId);
  }
  if (lethal.length > 0) {
    morning.die(personId, ChangeReason.DiedGotKilled, { role: lethal[0].byCharacterId });
  } else {
    morning.survive(personId, raid.keptOutBy ?? raid.sparedBy ?? HEALER.id);
  }

  if (raid.lands && sleepover?.to === personId) {
    resolveGuest(state, morning, sleepover.from, personId);
  }
}

function raidOn(
  state: State,
  personId: string,
  marks: readonly VictimMark[],
  sleepover: Connection | undefined,
): Raid {
  const bites = marks.filter(isByWolves).length;
  if (bites === 0) {
    return { lands: false };
  }

  const keptOutBy = houseGuardOf(state, personId, sleepover);
  if (keptOutBy) {
    return { lands: false, keptOutBy };
  }
  return { lands: true, sparedBy: personalGuardOf(state, personId, bites) };
}

function resolveGuest(state: State, morning: Morning, guestId: string, hostId: string) {
  if (state.roles.healedTonight === guestId) {
    morning.survive(guestId, WITCH.id);
  } else {
    morning.die(guestId, ChangeReason.DiedSleptWithVictim, { person: hostId });
  }
}

function resolveDueWounds(state: State, morning: Morning) {
  for (const person of state.people) {
    if (hasStatus(person, PersonStatus.Wounded) && !isWoundedThisMorning(state, person.id)) {
      morning.die(person.id, ChangeReason.DiedGotKilled, { role: KNIGHT.id });
    }
  }
}

function resolveRoleModel(state: State, morning: Morning) {
  const trust = findConnection(state.connections, ConnectionType.Trust);
  if (trust && morning.dying.has(trust.to) && canTurnWolf(state, trust.from, morning)) {
    morning.changes.push({
      personId: trust.from,
      reason: ChangeReason.TurnedIntoWolf,
      causedBy: { person: trust.to },
    });
  }
}

function resolveHostDeath(morning: Morning, sleepover: Connection | undefined) {
  if (
    sleepover &&
    morning.dying.has(sleepover.to) &&
    !morning.raided.has(sleepover.to) &&
    morning.isLiving(sleepover.from)
  ) {
    morning.changes.push({
      personId: sleepover.from,
      reason: ChangeReason.SurvivedHostDeath,
      causedBy: { person: sleepover.to },
    });
  }
}

function knightWoundChanges(state: State, morning: Morning): DaybreakChange[] {
  const isHandledThisMorning = state.appliedChanges.some(
    (change) => change.reason === ChangeReason.WoundedByTheKnight,
  );
  if (isHandledThisMorning) {
    return state.people
      .filter(
        (person) =>
          hasStatus(person, PersonStatus.Wounded) && isWoundedThisMorning(state, person.id),
      )
      .map((person) => woundChange(person.id));
  }

  const wolf = wolfTheKnightWounds(state, morning);
  return wolf ? [woundChange(wolf)] : [];
}

function wolfTheKnightWounds(state: State, morning: Morning) {
  const seat = state.people.findIndex((person) => person.character?.id === KNIGHT.id);
  const knight = state.people[seat];
  if (!knight) {
    return undefined;
  }

  const death = morning.changes.find(
    (change) => change.personId === knight.id && change.reason === ChangeReason.DiedGotKilled,
  );
  const killer = death && 'role' in death.causedBy ? death.causedBy.role : undefined;
  if (!killer || !isWolfRole(killer)) {
    return undefined;
  }

  const loneWolf =
    killer === WEREWOLF.id
      ? undefined
      : state.people.find(
          (person) => person.character?.id === killer && morning.isLiving(person.id),
        );
  if (loneWolf) {
    return loneWolf.id;
  }

  const leftOfTheKnight = [...state.people.slice(seat + 1), ...state.people.slice(0, seat)];
  return leftOfTheKnight.find((person) => morning.isLiving(person.id) && isWerewolf(person))?.id;
}

function wasAppliedThisMorning(state: State, personId: string, reason: ChangeReason) {
  return includesChange(state.appliedChanges, { personId, reason });
}

function includesChange(
  changes: readonly DaybreakChange[],
  change: Pick<DaybreakChange, 'personId' | 'reason'>,
) {
  return changes.some(
    (other) => other.personId === change.personId && other.reason === change.reason,
  );
}

function partnerOf(love: Connection | undefined, personId: string) {
  if (love?.from === personId) {
    return love.to;
  }
  return love?.to === personId ? love.from : undefined;
}

function isWolfRole(characterId: string) {
  return CHARACTERS_BY_ID.get(characterId) instanceof WerewolfCharacter;
}

function isByWolves(mark: VictimMark) {
  return isWolfRole(mark.byCharacterId);
}

function houseGuardOf(state: State, personId: string, sleepover: Connection | undefined) {
  if (sleepover?.from === personId) {
    return HOODRAT.id;
  }
  const person = personById(state, personId);
  const isGuarded =
    person && hasStatus(person, PersonStatus.Protected) && person.character?.id !== SMALL_CHILD.id;
  return isGuarded ? HEALER.id : undefined;
}

function personalGuardOf(state: State, personId: string, bites: number) {
  if (state.roles.healedTonight === personId) {
    return WITCH.id;
  }
  const person = personById(state, personId);
  const hasExtraLife =
    person?.character?.id === ELDER.id && !state.roles.usedAbilities.includes('elder_life');
  return hasExtraLife && bites === 1 ? ELDER.id : undefined;
}

function personById(state: State, personId: string) {
  return state.people.find((person) => person.id === personId);
}

function canTurnWolf(state: State, childId: string, morning: Morning) {
  const child = personById(state, childId);
  const wasWolfAlready =
    child !== undefined &&
    hasStatus(child, PersonStatus.TurnedWolf) &&
    !wasAppliedThisMorning(state, childId, ChangeReason.TurnedIntoWolf);
  return morning.isLiving(childId) && !wasWolfAlready;
}
