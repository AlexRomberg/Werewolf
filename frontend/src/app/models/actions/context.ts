import type { Character } from '../character';
import {
  Ability,
  Connection,
  ConnectionType,
  findConnection,
  hasStatus,
  Person,
  PersonStatus,
  RoleStates,
  VictimMark,
} from '../../services/state/types';

export interface NightContext {
  readonly round: number;
  readonly people: readonly Person[];
  readonly assigned: readonly Person[];
  readonly cardCount: number;
  readonly victims: readonly VictimMark[];
  readonly connections: readonly Connection[];
  readonly roles: RoleStates;
  readonly leftover: readonly Character[];
}

export function isFirstNight(context: NightContext) {
  return context.round === 0;
}

export function isAssigned(context: NightContext) {
  return context.assigned.length >= context.cardCount;
}

export function hasConnection(context: NightContext, type: ConnectionType) {
  return findConnection(context.connections, type) !== undefined;
}

export function hasMarkedVictim(context: NightContext, characterId: string) {
  return context.victims.some((mark) => mark.byCharacterId === characterId);
}

export function isAbilityUsed(context: NightContext, ability: Ability) {
  return context.roles.usedAbilities.includes(ability);
}

export function someoneHas(context: NightContext, status: PersonStatus) {
  return context.people.some((person) => hasStatus(person, status));
}
