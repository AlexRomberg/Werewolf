import { computed, WritableSignal } from '@angular/core';
import { State } from './types';
import { Villager } from '../../models/villager';
import { Character } from '../../models/character';

export class CharacterState {
    constructor(private state: WritableSignal<State>) { }

    readonly all = computed(() => [...this.state().characters.values()]);
    readonly cards = computed(() => {
        const { characters, people } = this.state();

        const deck = [...characters.values()].flatMap(({ character, amount }) =>
            new Array<Character>(amount).fill(character),
        );
        const missing = Math.max(0, people.length - deck.length);

        return [...deck, ...new Array<Character>(missing).fill(new Villager())];
    });

    add(character: Character) {
        this.state.update((state) => {
            if (state.characters.has(character.id)) {
                return state;
            }

            const characters = new Map(state.characters);
            characters.set(character.id, { character, amount: 1 });
            return { ...state, characters };
        });
    }


    remove(character: Character) {
        this.state.update((state) => {
            const characters = new Map(state.characters);
            characters.delete(character.id);
            return { ...state, characters };
        });
    }

    setAmount(character: Character, amount: number) {
        if (amount < 1) {
            this.remove(character);
            return;
        }

        if (!character.hasMultiple) {
            this.add(character);
            return;
        }

        this.state.update((state) => {
            const characters = new Map(state.characters);
            characters.set(character.id, { character, amount });
            return { ...state, characters };
        });
    }
}
