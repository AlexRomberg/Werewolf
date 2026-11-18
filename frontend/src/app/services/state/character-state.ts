import { computed, WritableSignal } from '@angular/core';
import { Character, copiesOf } from '../../models/character';
import { THIEF, VILLAGER } from '../../models/characters';
import { CharacterSelection, State } from './types';

export const THIEF_MIDDLE_CARDS = 2;

export class CharacterState {
  constructor(private state: WritableSignal<State>) {}

  readonly selection = computed<ReadonlyMap<string, CharacterSelection>>(
    () => this.state().characters,
  );

  readonly requiredVillagers = computed(() => requiredVillagers(this.state()));

  readonly villagerCount = computed(() => villagerCount(this.state()));

  readonly cards = computed(() => deckOf(this.state()));

  readonly inPlay = computed<readonly Character[]>(() => [...new Set(this.cards())]);

  readonly excessCards = computed(() =>
    Math.max(0, seatsFor(this.cards()) - this.state().people.length),
  );

  readonly leftover = computed(() => leftoverCards(this.state()));

  amountOf(character: Character) {
    return character.id === VILLAGER.id ? this.villagerCount() : this.storedAmount(character);
  }

  replaceSelection(entries: [Character, number][]) {
    this.state.update((state) => ({
      ...state,
      characters: new Map(
        entries
          .filter(([, amount]) => amount > 0)
          .map(([character, amount]) => [character.id, { character, amount }]),
      ),
    }));
  }

  toggle(character: Character) {
    this.setAmount(character, this.storedAmount(character) > 0 ? 0 : 1);
  }

  setAmount(character: Character, amount: number) {
    const wanted = character.hasMultiple ? amount : Math.min(amount, 1);
    this.state.update((state) => {
      const characters = new Map(state.characters);
      if (wanted > 0) {
        characters.set(character.id, { character, amount: wanted });
      } else {
        characters.delete(character.id);
      }
      return { ...state, characters };
    });
  }

  private storedAmount(character: Character) {
    return storedAmount(this.state(), character);
  }
}

export function deckOf(state: State): Character[] {
  return [...chosenCards(state), ...copiesOf(VILLAGER, villagerCount(state))];
}

export function seatsFor(deck: readonly Character[]) {
  return deck.length - (deck.some((card) => card.id === THIEF.id) ? THIEF_MIDDLE_CARDS : 0);
}

export function leftoverCards(state: State): Character[] {
  if (state.people.some((person) => !person.character)) {
    return [];
  }

  const leftover = deckOf(state);
  for (const person of state.people) {
    const index = leftover.findIndex((card) => card.id === person.character?.id);
    if (index !== -1) {
      leftover.splice(index, 1);
    }
  }
  return leftover;
}

function chosenCards(state: State) {
  return [...state.characters.values()]
    .filter(({ character }) => character.id !== VILLAGER.id)
    .flatMap(({ character, amount }) => copiesOf(character, amount));
}

function requiredVillagers(state: State) {
  const middleCards = state.characters.has(THIEF.id) ? THIEF_MIDDLE_CARDS : 0;
  return Math.max(0, state.people.length + middleCards - chosenCards(state).length);
}

function villagerCount(state: State) {
  return Math.max(requiredVillagers(state), storedAmount(state, VILLAGER));
}

function storedAmount(state: State, character: Character) {
  return state.characters.get(character.id)?.amount ?? 0;
}
