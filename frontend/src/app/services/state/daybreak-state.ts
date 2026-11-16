import { computed, WritableSignal } from '@angular/core';
import { CHARACTERS_BY_ID, HEALER, HOODRAT, WITCH } from '../../models/characters';
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

/** Whether the change alters the game; the rest are only announced. */
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
    applied.some(
      (change) =>
        change.personId === personId && STATUS_BY_REASON[change.reason] === PersonStatus.Dead,
    );
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

  const die = (
    personId: string,
    reason: ChangeReason,
    causedBy: ChangeCause,
    byWolves: boolean,
  ) => {
    if (!alive.has(personId) || dying.has(personId)) {
      return;
    }
    dying.add(personId);
    changes.push({ personId, reason, causedBy });

    const partner = partnerOf(love, personId);
    if (partner) {
      die(partner, ChangeReason.DiedOfBrokenHeart, { person: personId }, false);
    }
    if (byWolves && sleepover?.to === personId) {
      die(sleepover.from, ChangeReason.DiedSleptWithVictim, { person: personId }, false);
    }
  };

  for (const personId of new Set(state.victims.map((mark) => mark.personId))) {
    const marks = state.victims.filter((mark) => mark.personId === personId);
    const lethal = marks.filter((mark) => !(isByWolves(mark) && blockerOf(state, mark, sleepover)));
    if (lethal.length > 0) {
      die(
        personId,
        ChangeReason.DiedGotKilled,
        { role: lethal[0].byCharacterId },
        lethal.some(isByWolves),
      );
    } else if (alive.has(personId)) {
      const savedBy = blockerOf(state, marks[0], sleepover) ?? HEALER.id;
      changes.push({ personId, reason: ChangeReason.SurvivedAttack, causedBy: { role: savedBy } });
    }
  }

  if (trust && dying.has(trust.to) && canTurnWolf(state, trust.from, alive, dying)) {
    changes.push({
      personId: trust.from,
      reason: ChangeReason.TurnedIntoWolf,
      causedBy: { person: trust.to },
    });
  }

  if (sleepover && dying.has(sleepover.to) && isLiving(sleepover.from, alive, dying)) {
    changes.push({
      personId: sleepover.from,
      reason: ChangeReason.SurvivedHostDeath,
      causedBy: { person: sleepover.to },
    });
  }

  // Surviving the wolves is no news about someone who then dies of something else.
  return changes.filter(
    (change) => change.reason !== ChangeReason.SurvivedAttack || !dying.has(change.personId),
  );
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

/** The role that keeps a wolf attack from killing, if any. */
function blockerOf(state: State, mark: VictimMark, sleepover: Connection | undefined) {
  const victim = state.people.find((person) => person.id === mark.personId);
  if (state.roles.healedTonight === mark.personId) {
    return WITCH.id;
  }
  if (victim && hasStatus(victim, PersonStatus.Protected)) {
    return HEALER.id;
  }
  return sleepover?.from === mark.personId ? HOODRAT.id : undefined;
}

function canTurnWolf(state: State, childId: string, alive: Set<string>, dying: Set<string>) {
  const child = state.people.find((person) => person.id === childId);
  const turnedThisMorning = state.appliedChanges.some(
    (change) => change.personId === childId && change.reason === ChangeReason.TurnedIntoWolf,
  );
  const wasWolfAlready =
    child !== undefined && hasStatus(child, PersonStatus.TurnedWolf) && !turnedThisMorning;
  return isLiving(childId, alive, dying) && !wasWolfAlready;
}
