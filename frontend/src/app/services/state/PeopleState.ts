import { computed, WritableSignal } from '@angular/core';
import { Person, State } from './types';

export class PeopleState {
  constructor(private state: WritableSignal<State>) {
    state.update((state) => ({
      ...state,
      people: createSeats(5),
    }));
  }

  readonly all = computed(() => this.state().people);

  add() {
    this.state.update((state) => ({
      ...state,
      people: [...state.people, createPerson()],
    }));
  }

  remove(id: string) {
    this.state.update((state) => ({
      ...state,
      people: state.people.filter((person) => person.id !== id),
    }));
  }

  rename(id: string, name: string) {
    this.updatePerson(id, (person) => ({ ...person, name: name.trim() }));
  }

  move(id: string, toIndex: number) {
    this.state.update((state) => {
      const from = state.people.findIndex((person) => person.id === id);
      if (from === -1) {
        return state;
      }

      const people = [...state.people];
      const [person] = people.splice(from, 1);
      people.splice(Math.min(Math.max(toIndex, 0), people.length), 0, person);
      return { ...state, people };
    });
  }

  private updatePerson(id: string, fn: (person: Person) => Person) {
    this.state.update((state) => ({
      ...state,
      people: state.people.map((person) => (person.id === id ? fn(person) : person)),
    }));
  }
}

function createSeats(count: number) {
  return Array.from({ length: count }, () => createPerson());
}

function createPerson(): Person {
  return {
    id: crypto.randomUUID(),
    name: '',
    states: new Set(),
    character: undefined,
  };
}
