import { computed, WritableSignal } from '@angular/core';
import { ActionCard, filterFalsy } from '../../models/actions/action';
import { NightContext } from '../../models/actions/context';
import {
  BearSignal,
  daybreakCard,
  nightfallCard,
  rulesCard,
} from '../../models/actions/generic-cards';
import { Character } from '../../models/character';
import { ANGEL, BEAR_TAMER, ELDER, WEREWOLF } from '../../models/characters';
import { isWerewolf } from '../../models/werewolf-character';
import { leftoverCards } from './character-state';
import {
  isPersonDead,
  isWoundedThisMorning,
  pendingChanges,
  resolveDaybreak,
} from './daybreak-state';
import {
  ChangeReason,
  ConnectionType,
  DaybreakChange,
  findConnection,
  hasStatus,
  isAlive,
  Person,
  PersonStatus,
  State,
} from './types';

export class ActionState {
  constructor(private state: WritableSignal<State>) {}

  readonly round = computed(() => this.state().round);

  readonly queue = computed<readonly ActionCard[]>(() => nightQueue(this.state()));

  readonly index = computed(() => this.state().actionIndex);
  readonly current = computed<ActionCard | undefined>(() => this.queue()[this.index()]);
  readonly canGoBack = computed(() => this.index() > 0);
  readonly isLastCard = computed(() => this.index() >= this.queue().length - 1);

  readonly currentContext = computed<NightContext | undefined>(() => {
    const character = this.state().characters.get(this.current()?.id ?? '')?.character;
    return character && contextFor(this.state(), character);
  });

  next() {
    this.state.update((state) =>
      this.isLastCard() ? startNextNight(state) : { ...state, actionIndex: state.actionIndex + 1 },
    );
  }

  back() {
    this.state.update((state) =>
      state.actionIndex > 0 ? { ...state, actionIndex: state.actionIndex - 1 } : state,
    );
  }
}

export function isAtDaybreak(state: State) {
  return state.phase === 'playing' && state.actionIndex >= nightQueue(state).length - 1;
}

export function beginNight(state: State): State {
  return {
    ...state,
    awake: charactersInNightOrder(state, (character) => isAwakeTonight(state, character)),
  };
}

function startNextNight(state: State): State {
  const protectedPerson = state.people.find((person) => hasStatus(person, PersonStatus.Protected));
  const sleepover = findConnection(state.connections, ConnectionType.Sleepover);
  const morning = resolveDaybreak(state);
  const elderWasBitten = morning.some(
    (change) => change.reason === ChangeReason.SurvivedAttack && isCausedBy(change, ELDER),
  );

  return beginNight({
    ...state,
    round: state.round + 1,
    actionIndex: 0,
    victims: [],
    appliedChanges: [],
    people: state.people.map((person) => ({
      ...person,
      statuses: person.statuses.filter(
        (status) =>
          status !== PersonStatus.Protected &&
          (status !== PersonStatus.Wounded || isWoundedThisMorning(state, person.id)),
      ),
    })),
    connections: state.connections.filter(
      (connection) => connection.type !== ConnectionType.Sleepover,
    ),
    roles: {
      ...state.roles,
      usedAbilities:
        elderWasBitten && !state.roles.usedAbilities.includes('elder_life')
          ? [...state.roles.usedAbilities, 'elder_life']
          : state.roles.usedAbilities,
      enchantedTonight: [],
      healedTonight: undefined,
      healerLastProtected: protectedPerson?.id,
      hoodratLastHost: sleepover?.to,
      middleCardsShownTo: undefined,
    },
  });
}

function nightQueue(state: State): ActionCard[] {
  const selected = selectedCharacters(state);
  const awake = state.awake.flatMap((id) => state.characters.get(id)?.character ?? []);

  return [
    ...(hasRulesCard(state) ? [rulesCard(state.round, selected, leftoverCards(state))] : []),
    ...(opensWithTheAngel(state) ? [characterCard(state, ANGEL)] : []),
    nightfallCard(state.round),
    ...awake.map((character) => characterCard(state, character)),
    daybreakCard(state.round, pendingChanges(state).length, bearSignal(state)),
  ];
}

function bearSignal(state: State): BearSignal | undefined {
  if (!state.characters.has(BEAR_TAMER.id)) {
    return undefined;
  }

  const morning = resolveDaybreak(state);
  const dying = new Set(morning.filter(isPersonDead).map((change) => change.personId));
  const turning = new Set(
    morning
      .filter((change) => change.reason === ChangeReason.TurnedIntoWolf)
      .map((change) => change.personId),
  );
  const living = state.people.filter((person) => isAlive(person) && !dying.has(person.id));
  const isTamer = (person: Person) => person.character?.id === BEAR_TAMER.id;
  const seat = living.findIndex(isTamer);
  if (seat === -1) {
    return state.people.some(isTamer) ? undefined : 'unknown';
  }

  const isWolf = (person: Person) => isWerewolf(person) || turning.has(person.id);
  const neighbours = [
    living[(seat - 1 + living.length) % living.length],
    living[(seat + 1) % living.length],
  ].filter((person) => person !== living[seat]);
  return isWolf(living[seat]) || neighbours.some(isWolf) ? 'growl' : 'silent';
}

function isCausedBy(change: DaybreakChange, character: Character) {
  return 'role' in change.causedBy && change.causedBy.role === character.id;
}

function hasRulesCard(state: State) {
  return state.round === 0;
}

function opensWithTheAngel(state: State) {
  return state.round === 0 && state.characters.has(ANGEL.id);
}

function selectedCharacters(state: State) {
  return [...state.characters.values()].map(({ character }) => character);
}

function charactersInNightOrder(state: State, isCalled: (character: Character) => boolean) {
  return selectedCharacters(state)
    .filter(isCalled)
    .sort((a, b) => a.priority - b.priority)
    .map((character) => character.id);
}

function isAwakeTonight(state: State, character: Character) {
  const context = contextFor(state, character);
  if (!character.isAwakeThisNight(context)) {
    return false;
  }

  if (character.id === WEREWOLF.id) {
    return true;
  }

  return context.assigned.length === 0 || context.assigned.some(isAlive);
}

function contextFor(state: State, character: Character): NightContext {
  return {
    round: state.round,
    people: state.people,
    assigned: state.people.filter((person) => person.character?.id === character.id),
    cardCount: state.characters.get(character.id)?.amount ?? 1,
    victims: state.victims,
    connections: state.connections,
    roles: state.roles,
    leftover: leftoverCards(state),
  };
}

function characterCard(state: State, character: Character): ActionCard {
  const context = contextFor(state, character);

  return {
    key: `${context.round}:${character.id}`,
    id: character.id,
    title: character.name,
    image: character.image,
    actions: filterFalsy(character.getActions(context)),
    buttons: character.getButtons(context),
  };
}
