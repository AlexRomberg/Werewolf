import { Service, Signal, WritableSignal, computed, signal } from '@angular/core';
import { Character } from '../models/character';

export enum PlayerStatus {
  Dead = 'dead',
  Protected = 'protected',
  InLove = 'in_love',
}

export interface Person {
  id: string;
  name: string;
  character?: Character;
  states: Set<PlayerStatus>;
}

interface State {
  people: Person[];
}

export const MIN_PLAYERS = 5;

@Service()
export class GameService {
  private state: WritableSignal<State>;

  constructor() {
    this.state = signal<State>({
      people: createSeats(MIN_PLAYERS),
    });
  }

  public readonly people = computed<readonly Person[]>(() =>
    this.state().people.map((person, index) => ({
      ...person,
    })),
  );

  public readonly canStart = computed(() => this.state().people.length >= MIN_PLAYERS);

  addPerson() {
    this.state.update((state) => ({
      ...state,
      people: [...state.people, createPerson()],
    }));
  }

  removePerson(id: string) {
    this.state.update((state) => ({
      ...state,
      people: state.people.filter((person) => person.id !== id),
    }));
  }

  renamePerson(id: string, name: string) {
    this.updatePerson(id, (person) => ({ ...person, name: name.trim() }));
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
