import { NightContext } from '../models/actions/context';
import { Person } from '../services/state/types';

export function night(round = 0, overrides: Partial<NightContext> = {}): NightContext {
  return {
    round,
    people: [],
    assigned: [],
    cardCount: 1,
    victims: [],
    connections: [],
    roles: { usedAbilities: [], enchantedTonight: [] },
    leftover: [],
    ...overrides,
  };
}

let seat = 0;

export function person(overrides: Partial<Person> = {}): Person {
  return { id: `person-${++seat}`, name: '', statuses: [], ...overrides };
}

export function seated(round = 0, count = 1, overrides: Partial<NightContext> = {}): NightContext {
  const assigned = Array.from({ length: count }, () => person());
  return night(round, { assigned, people: assigned, cardCount: count, ...overrides });
}
