import { Character } from '../../models/character';

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

export interface CharacterSelection {
  character: Character;
  amount: number;
}

export interface State {
  people: Person[];
  characters: Map<string, CharacterSelection>;
}

export const MIN_PLAYERS = 5;
