import { computed, WritableSignal } from '@angular/core';
import { Character } from '../../models/character';
import { isAlive, NightBadge, Person, PersonView, PersonStatus, PersonBadge, State } from './types';

export class PeopleState {
  constructor(private state: WritableSignal<State>) {}

  readonly all = computed(() => this.state().people);

  readonly views = computed<readonly PersonView[]>(() => {
    const { people, victims, roles } = this.state();

    return people.map((person, index) => {
      const statusBadges = person.statuses.filter(
        (status): status is Exclude<PersonStatus, PersonStatus.Dead> =>
          status !== PersonStatus.Dead,
      );
      const nightBadges: (NightBadge | false)[] = [
        victims.some((mark) => mark.personId === person.id) && 'victim',
        roles.healedTonight === person.id && 'healed',
      ];
      const badges: PersonBadge[] = [
        ...statusBadges,
        ...nightBadges.filter((badge) => badge !== false),
      ];

      return {
        ...person,
        seat: index + 1,
        displayName: person.name || `Seat ${index + 1}`,
        isDead: !isAlive(person),
        badges,
      };
    });
  });

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
      connections: state.connections.filter(({ from, to }) => from !== id && to !== id),
      victims: state.victims.filter((mark) => mark.personId !== id),
    }));
  }

  update(id: string, person: Person) {
    this.state.update((state) => ({
      ...state,
      people: state.people.map((existing) => (existing.id === id ? person : existing)),
    }));
  }

  assign(ids: readonly string[], character: Character) {
    this.state.update((state) => ({
      ...state,
      people: state.people.map((person) =>
        ids.includes(person.id) ? { ...person, character } : person,
      ),
    }));
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
}

export function createSeats(count: number): Person[] {
  return Array.from({ length: count }, createPerson);
}

function createPerson(): Person {
  return {
    id: crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 15),
    name: '',
    statuses: [],
    character: undefined,
  };
}
