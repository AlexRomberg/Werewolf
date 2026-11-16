import { computed, WritableSignal } from '@angular/core';
import { ActionCard, filterFalsy } from '../../models/actions/action';
import { NightContext } from '../../models/actions/context';
import { daybreakCard, nightfallCard, rulesCard } from '../../models/actions/generic';
import { Character } from '../../models/character';
import { WEREWOLF } from '../../models/characters';
import { ConnectionType, isAlive, PlayerStatus, State } from './types';
import { pendingChanges } from './DaybreakState';

export class ActionState {
  constructor(private state: WritableSignal<State>) {}

  readonly round = computed(() => this.state().round);

  readonly queue = computed<readonly ActionCard[]>(() => {
    const state = this.state();
    const selected = selectedCharacters(state);
    const awake = state.awake.flatMap((id) => state.characters.get(id)?.character ?? []);

    return [
      ...(state.round === 0 ? [rulesCard(state.round, selected)] : []),
      nightfallCard(state.round),
      ...awake.map((character) => toCard(state, character)),
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

  wakeRestoredRoles() {
    this.state.update(wakeRestoredRoles);
  }

  back() {
    this.state.update((state) =>
      state.actionIndex > 0 ? { ...state, actionIndex: state.actionIndex - 1 } : state,
    );
  }
}

export function beginNight(state: State): State {
  return {
    ...state,
    awake: selectedCharacters(state)
      .filter((character) => isAwakeTonight(state, character))
      .sort((a, b) => a.priority - b.priority)
      .map((character) => character.id),
  };
}

function wakeRestoredRoles(state: State): State {
  const awake = selectedCharacters(state)
    .filter((character) => state.awake.includes(character.id) || isAwakeTonight(state, character))
    .sort((a, b) => a.priority - b.priority)
    .map((character) => character.id);

  const cardsBeforeRoles = state.round === 0 ? 2 : 1;
  const position = state.actionIndex - cardsBeforeRoles;
  if (position < 0) {
    return { ...state, awake };
  }

  const current = state.awake[position];
  const newPosition = current === undefined ? awake.length : awake.indexOf(current);
  return { ...state, awake, actionIndex: cardsBeforeRoles + newPosition };
}

function selectedCharacters(state: State) {
  return [...state.characters.values()].map(({ character }) => character);
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

function toCard(state: State, character: Character): ActionCard {
  const context = contextFor(state, character);

  return {
    key: `${context.round}:${character.id}`,
    id: character.id,
    title: character.name,
    image: `img/${character.id}.png`,
    actions: filterFalsy(character.getActions(context)),
    buttons: character.getButtons(context),
  };
}

function isAwakeTonight(state: State, character: Character) {
  const context = contextFor(state, character);
  if (!character.isAwakeThisNight(context)) {
    return false;
  }

  // NOTE (ARO): Without werewolfs the game would be over
  if (character.id === WEREWOLF.id) {
    return true;
  }

  return context.assigned.length === 0 || context.assigned.some(isAlive);
}

function startNextNight(state: State): State {
  const protectedPerson = state.people.find((person) =>
    person.statuses.includes(PlayerStatus.Protected),
  )?.id;
  const sleepoverHost = state.connections.find(
    (connection) => connection.type === ConnectionType.Sleepover,
  )?.to;

  return beginNight({
    ...state,
    round: state.round + 1,
    actionIndex: 0,
    victims: [],
    appliedChanges: [],
    people: state.people.map((person) => ({
      ...person,
      statuses: person.statuses.filter((status) => status !== PlayerStatus.Protected),
    })),
    connections: state.connections.filter(
      (connection) => connection.type !== ConnectionType.Sleepover,
    ),
    roles: {
      ...state.roles,
      enchantedTonight: [],
      healedTonight: undefined,
      healerLastProtected: protectedPerson,
      hoodratLastHost: sleepoverHost,
    },
  });
}
