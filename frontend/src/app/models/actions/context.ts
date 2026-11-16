import {
  Connection,
  ConnectionType,
  Ability,
  Person,
  PlayerStatus,
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
}

export function isAssigned(context: NightContext) {
  return context.assigned.length >= context.cardCount;
}

export function hasConnection(context: NightContext, type: ConnectionType) {
  return context.connections.some((connection) => connection.type === type);
}

export function hasMarkedVictim(context: NightContext, characterId: string) {
  return context.victims.some((victim) => victim.byCharacterId === characterId);
}

export function isAbilityUsed(context: NightContext, ability: Ability) {
  return context.roles.usedAbilities.includes(ability);
}

export function someoneHas(context: NightContext, status: PlayerStatus) {
  return context.people.some((person) => person.statuses.includes(status));
}
