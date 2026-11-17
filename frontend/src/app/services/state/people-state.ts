import { computed, WritableSignal } from '@angular/core';
import { Character } from '../../models/character';
import type { LinkType, PlayerCard, PlayerLink } from '@protocol';
import { isWerewolf } from '../../models/werewolf-character';
import {
  Connection,
  ConnectionType,
  hasStatus,
  isAlive,
  MAX_SEATS,
  NightBadge,
  Person,
  PersonBadge,
  PersonStatus,
  PersonView,
  State,
} from './types';

const KNOWN_BY: Record<ConnectionType, readonly ('from' | 'to')[]> = {
  [ConnectionType.Love]: ['from', 'to'],
  [ConnectionType.Trust]: ['from'],
  [ConnectionType.Sleepover]: ['from'],
};

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

  readonly cards = computed<ReadonlyMap<string, PlayerCard>>(() => {
    const { connections } = this.state();
    const views = this.views();
    const nameById = new Map(views.map((view) => [view.id, view.displayName]));

    return new Map(
      views.map((person) => [
        person.id,
        {
          name: person.displayName,
          characterId: person.character?.id ?? null,
          isDead: person.isDead,
          isWerewolf: isWerewolf(person),
          isEnchanted: hasStatus(person, PersonStatus.Enchanted),
          links: linksKnownBy(person.id, connections, nameById),
        },
      ]),
    );
  });

  add() {
    this.append(createPerson());
  }

  takeSeat(name: string): string | null {
    const { people } = this.state();
    const unnamed = people.find((person) => !person.name);
    if (unnamed) {
      this.update(unnamed.id, { ...unnamed, name });
      return unnamed.id;
    }
    if (people.length >= MAX_SEATS) {
      return null;
    }

    const person = { ...createPerson(), name };
    this.append(person);
    return person.id;
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

  dealOut(deck: readonly Character[]) {
    this.state.update((state) => ({
      ...state,
      people: state.people.map((person, index) => ({ ...person, character: deck[index] })),
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

  private append(person: Person) {
    this.state.update((state) => ({ ...state, people: [...state.people, person] }));
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

function linksKnownBy(
  personId: string,
  connections: readonly Connection[],
  nameById: ReadonlyMap<string, string>,
): PlayerLink[] {
  return connections.flatMap(({ type, from, to }) => {
    const end = from === personId ? 'from' : to === personId ? 'to' : null;
    const otherId = end === 'from' ? to : from;
    return end && KNOWN_BY[type].includes(end)
      ? [{ type: type as LinkType, name: nameById.get(otherId) ?? '' }]
      : [];
  });
}
