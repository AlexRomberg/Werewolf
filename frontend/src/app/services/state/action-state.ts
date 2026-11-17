import { computed, WritableSignal } from '@angular/core';
import { ActionCard, filterFalsy } from '../../models/actions/action';
import { NightContext } from '../../models/actions/context';
import { daybreakCard, nightfallCard, rulesCard } from '../../models/actions/generic-cards';
import { Character } from '../../models/character';
import { WEREWOLF } from '../../models/characters';
import { pendingChanges } from './daybreak-state';
import { ConnectionType, findConnection, hasStatus, isAlive, PersonStatus, State } from './types';

export class ActionState {
  constructor(private state: WritableSignal<State>) {}

  readonly round = computed(() => this.state().round);

  readonly queue = computed<readonly ActionCard[]>(() => {
    const state = this.state();
    const selected = selectedCharacters(state);
    const awake = state.awake.flatMap((id) => state.characters.get(id)?.character ?? []);

    return [
      ...(hasRulesCard(state) ? [rulesCard(state.round, selected)] : []),
      nightfallCard(state.round),
      ...awake.map((character) => characterCard(state, character)),
      daybreakCard(state.round, selected, pendingChanges(state).length),
    ];
  });

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

  wakeRestoredRoles() {
    this.state.update(wakeRestoredRoles);
  }
}

export function beginNight(state: State): State {
  return {
    ...state,
    awake: charactersInNightOrder(state, (character) => isAwakeTonight(state, character)),
  };
}

function wakeRestoredRoles(state: State): State {
  const awake = charactersInNightOrder(
    state,
    (character) => state.awake.includes(character.id) || isAwakeTonight(state, character),
  );

  const cardsBeforeRoles = hasRulesCard(state) ? 2 : 1;
  const position = state.actionIndex - cardsBeforeRoles;
  if (position < 0) {
    return { ...state, awake };
  }

  const current = state.awake[position];
  const newPosition = current === undefined ? awake.length : awake.indexOf(current);
  return { ...state, awake, actionIndex: cardsBeforeRoles + newPosition };
}

function startNextNight(state: State): State {
  const protectedPerson = state.people.find((person) => hasStatus(person, PersonStatus.Protected));
  const sleepover = findConnection(state.connections, ConnectionType.Sleepover);

  return beginNight({
    ...state,
    round: state.round + 1,
    actionIndex: 0,
    victims: [],
    appliedChanges: [],
    people: state.people.map((person) => ({
      ...person,
      statuses: person.statuses.filter((status) => status !== PersonStatus.Protected),
    })),
    connections: state.connections.filter(
      (connection) => connection.type !== ConnectionType.Sleepover,
    ),
    roles: {
      ...state.roles,
      enchantedTonight: [],
      healedTonight: undefined,
      healerLastProtected: protectedPerson?.id,
      hoodratLastHost: sleepover?.to,
    },
  });
}

function hasRulesCard(state: State) {
  return state.round === 0;
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
