import { computed, WritableSignal } from '@angular/core';
import { CharacterSelection, State } from './types';
import { VILLAGER } from '../../models/characters';
import { Character } from '../../models/character';

export class CharacterState {
  constructor(private state: WritableSignal<State>) { }

  readonly selection = computed<ReadonlyMap<string, CharacterSelection>>(
    () => this.state().characters,
  );

  private chosenDeck = computed(() =>
    [...this.state().characters.values()]
      .filter(({ character }) => character.id !== VILLAGER.id)
      .flatMap(({ character, amount }) => new Array<Character>(amount).fill(character)),
  );

  readonly requiredVillagers = computed(() =>
    Math.max(0, this.state().people.length - this.chosenDeck().length),
  );

  readonly villagerCount = computed(() =>
    Math.max(this.requiredVillagers(), this.storedAmount(VILLAGER)),
  );

  readonly cards = computed(() => [
    ...this.chosenDeck(),
    ...new Array<Character>(this.villagerCount()).fill(VILLAGER),
  ]);

  readonly excessCards = computed(() =>
    Math.max(0, this.cards().length - this.state().people.length),
  );

  amountOf(character: Character) {
    return character.id === VILLAGER.id ? this.villagerCount() : this.storedAmount(character);
  }

  replaceSelection(entries: [Character, number][]) {
    this.state.update((state) => ({
      ...state,
      characters: new Map(
        [...entries]
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
    return this.state().characters.get(character.id)?.amount ?? 0;
  }
}
