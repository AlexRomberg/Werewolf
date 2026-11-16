import { Character } from '../../models/character';

export enum PersonStatus {
  Dead = 'dead',
  Protected = 'protected',
  Enchanted = 'enchanted',
  TurnedWolf = 'turned_wolf',
}

export enum ConnectionType {
  Love = 'love',
  Trust = 'trust',
  Sleepover = 'sleepover',
}

export interface Connection {
  type: ConnectionType;
  from: string;
  to: string;
}

export interface VictimMark {
  personId: string;
  byCharacterId: string;
}

export enum ChangeReason {
  DiedGotKilled = 'died_got_killed',
  DiedSleptWithVictim = 'died_slept_with_victim',
  DiedOfBrokenHeart = 'died_of_broken_heart',
  TurnedIntoWolf = 'turned_into_wolf',
  SurvivedAttack = 'survived_attack',
  SurvivedHostDeath = 'survived_host_death',
}

export type ChangeCause = { role: string } | { person: string };

export interface DaybreakChange {
  personId: string;
  reason: ChangeReason;
  causedBy: ChangeCause;
}

export type Ability = 'witch_heal' | 'witch_poison' | 'fox_request' | 'primal_wolf_infection';

export const ABILITY_LABELS: Record<Ability, string> = {
  witch_heal: 'Witch: healing potion',
  witch_poison: 'Witch: poison',
  fox_request: 'Fox: has missed',
  primal_wolf_infection: 'Primal Wolf: infection',
};

export interface RoleStates {
  usedAbilities: Ability[];
  enchantedTonight: string[];
  healedTonight?: string;
  healerLastProtected?: string;
  hoodratLastHost?: string;
}

export interface Person {
  id: string;
  name: string;
  character?: Character;
  statuses: PersonStatus[];
}

export type NightBadge = 'victim' | 'healed';
export type PersonBadge = Exclude<PersonStatus, PersonStatus.Dead> | NightBadge;

export const STATUS_LABELS: Record<PersonStatus | NightBadge, string> = {
  [PersonStatus.Dead]: 'Dead',
  [PersonStatus.Protected]: 'Protected',
  [PersonStatus.Enchanted]: 'Enchanted',
  [PersonStatus.TurnedWolf]: 'Turned wolf',
  victim: 'Marked as a victim',
  healed: 'Healed',
};

export interface PersonView extends Person {
  seat: number;
  displayName: string;
  isDead: boolean;
  badges: readonly PersonBadge[];
}

export interface CharacterSelection {
  character: Character;
  amount: number;
}

export interface State {
  phase: 'setup' | 'playing';
  round: number;
  actionIndex: number;
  people: Person[];
  characters: Map<string, CharacterSelection>;
  awake: string[];
  connections: Connection[];
  victims: VictimMark[];
  roles: RoleStates;
  appliedChanges: DaybreakChange[];
}

export const INITIAL_ROLE_STATE: RoleStates = {
  usedAbilities: [],
  enchantedTonight: [],
};

export const INITIAL_SEATS = 5;

export function hasStatus(person: Person, status: PersonStatus) {
  return person.statuses.includes(status);
}

export function isAlive(person: Person) {
  return !hasStatus(person, PersonStatus.Dead);
}

export function findConnection(connections: readonly Connection[], type: ConnectionType) {
  return connections.find((connection) => connection.type === type);
}
