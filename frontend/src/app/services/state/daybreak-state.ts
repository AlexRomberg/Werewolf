import { computed, WritableSignal } from '@angular/core';
import {
  CHARACTERS_BY_ID,
  ELDER,
  HEALER,
  HOODRAT,
  KNIGHT,
  SMALL_CHILD,
  WITCH,
} from '../../models/characters';
import { WerewolfCharacter } from '../../models/werewolf-character';
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
};

export class DaybreakState {
  constructor(private state: WritableSignal<State>) {}

  readonly changes = computed<readonly DaybreakChange[]>(() => resolveDaybreak(this.state()));
  readonly pending = computed<readonly DaybreakChange[]>(() => pendingChanges(this.state()));

  isApplied(change: DaybreakChange) {
    return includesChange(this.state().appliedChanges, change);
  }

  apply(change: DaybreakChange) {
    this.state.update((state) =>
      includesChange(state.appliedChanges, change) ? state : applyChange(state, change),
    );
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
  const applied = state.appliedChanges;
  const diedThisMorning = (personId: string) =>
    applied.some((change) => change.personId === personId && isDeath(change));
  const alive = new Set(
    state.people
      .filter((person) => isAlive(person) || diedThisMorning(person.id))
      .map((person) => person.id),
  );
  const love = findConnection(state.connections, ConnectionType.Love);
  const trust = findConnection(state.connections, ConnectionType.Trust);
  const sleepover = findConnection(state.connections, ConnectionType.Sleepover);

  const changes: DaybreakChange[] = [];
  const dying = new Set<string>();
  const raided = new Set<string>();

  const die = (personId: string, reason: ChangeReason, causedBy: ChangeCause) => {
    if (!alive.has(personId) || dying.has(personId)) {
      return;
    }
    dying.add(personId);
    changes.push({ personId, reason, causedBy });

    const partner = partnerOf(love, personId);
    if (partner) {
      die(partner, ChangeReason.DiedOfBrokenHeart, { person: personId });
    }
  };

  const survive = (personId: string, savedBy: string) => {
    const reported = changes.some(
      (change) => change.personId === personId && change.reason === ChangeReason.SurvivedAttack,
    );
    if (alive.has(personId) && !reported) {
      changes.push({ personId, reason: ChangeReason.SurvivedAttack, causedBy: { role: savedBy } });
    }
  };

  for (const personId of new Set(state.victims.map((mark) => mark.personId))) {
    const marks = state.victims.filter((mark) => mark.personId === personId);
    const bites = marks.filter(isByWolves).length;
    const keptOut = bites > 0 ? houseGuardOf(state, personId, sleepover) : undefined;
    const raidLands = bites > 0 && !keptOut;
    const spared = raidLands ? personalGuardOf(state, personId, bites) : undefined;
    const lethal = marks.filter((mark) => !isByWolves(mark) || (raidLands && !spared));

    if (raidLands) {
      raided.add(personId);
    }
    if (lethal.length > 0) {
      die(personId, ChangeReason.DiedGotKilled, { role: lethal[0].byCharacterId });
    } else {
      survive(personId, keptOut ?? spared ?? HEALER.id);
    }

    const guest = raidLands && sleepover?.to === personId ? sleepover.from : undefined;
    if (guest && state.roles.healedTonight === guest) {
      survive(guest, WITCH.id);
    } else if (guest) {
      die(guest, ChangeReason.DiedSleptWithVictim, { person: personId });
    }
  }

  if (state.roles.knightWound) {
    die(state.roles.knightWound, ChangeReason.DiedGotKilled, { role: KNIGHT.id });
  }

  if (trust && dying.has(trust.to) && canTurnWolf(state, trust.from, alive, dying)) {
    changes.push({
      personId: trust.from,
      reason: ChangeReason.TurnedIntoWolf,
      causedBy: { person: trust.to },
    });
  }

  if (
    sleepover &&
    dying.has(sleepover.to) &&
    !raided.has(sleepover.to) &&
    isLiving(sleepover.from, alive, dying)
  ) {
    changes.push({
      personId: sleepover.from,
      reason: ChangeReason.SurvivedHostDeath,
      causedBy: { person: sleepover.to },
    });
  }

  return changes.filter(
    (change) => change.reason !== ChangeReason.SurvivedAttack || !dying.has(change.personId),
  );
}

export function isDeath(change: DaybreakChange) {
  return STATUS_BY_REASON[change.reason] === PersonStatus.Dead;
}

function applyChange(state: State, change: DaybreakChange): State {
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

function isLiving(personId: string, alive: Set<string>, dying: Set<string>) {
  return alive.has(personId) && !dying.has(personId);
}

function includesChange(changes: readonly DaybreakChange[], change: DaybreakChange) {
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

function isByWolves(mark: VictimMark) {
  return CHARACTERS_BY_ID.get(mark.byCharacterId) instanceof WerewolfCharacter;
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

function canTurnWolf(state: State, childId: string, alive: Set<string>, dying: Set<string>) {
  const child = personById(state, childId);
  const turnedThisMorning = state.appliedChanges.some(
    (change) => change.personId === childId && change.reason === ChangeReason.TurnedIntoWolf,
  );
  const wasWolfAlready =
    child !== undefined && hasStatus(child, PersonStatus.TurnedWolf) && !turnedThisMorning;
  return isLiving(childId, alive, dying) && !wasWolfAlready;
}
