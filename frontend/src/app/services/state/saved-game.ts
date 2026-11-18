import { CHARACTERS_BY_ID } from '../../models/characters';
import { Person, State } from './types';

const SAVE_VERSION = 2;

type SavedPerson = Omit<Person, 'character'> & { character?: string };

export type SavedGame = Omit<State, 'people' | 'characters'> & {
  version: typeof SAVE_VERSION;
  people: SavedPerson[];
  characters: [id: string, amount: number][];
};

export function toSavedGame(state: State): SavedGame {
  return {
    ...state,
    version: SAVE_VERSION,
    people: state.people.map(({ character, ...person }) => ({
      ...person,
      character: character?.id,
    })),
    characters: [...state.characters.values()].map(({ character, amount }) => [
      character.id,
      amount,
    ]),
  };
}

export function fromSavedGame({ version, ...saved }: SavedGame): State {
  return {
    ...saved,
    people: saved.people.map(({ character, ...person }) => ({
      ...person,
      character: character === undefined ? undefined : CHARACTERS_BY_ID.get(character),
    })),
    characters: new Map(
      saved.characters.flatMap(([id, amount]) => {
        const character = CHARACTERS_BY_ID.get(id);
        return character ? [[id, { character, amount }] as const] : [];
      }),
    ),
  };
}

export function isSavedGame(value: unknown): value is SavedGame {
  if (!isRecord(value) || value['version'] !== SAVE_VERSION) {
    return false;
  }
  const { phase, round, actionIndex, people, characters, awake, roles } = value;
  return (
    (phase === 'setup' || phase === 'playing') &&
    isCount(round) &&
    isCount(actionIndex) &&
    isArrayOf(people, isSavedPerson) &&
    isArrayOf(characters, isSelectionEntry) &&
    isArrayOf(awake, isString) &&
    ['connections', 'victims', 'appliedChanges'].every((key) => Array.isArray(value[key])) &&
    isRecord(roles) &&
    Array.isArray(roles['usedAbilities']) &&
    Array.isArray(roles['enchantedTonight']) &&
    (roles['knightWound'] === undefined || isString(roles['knightWound'])) &&
    (roles['middleCardsShownTo'] === undefined || isString(roles['middleCardsShownTo']))
  );
}

function isSavedPerson(value: unknown): value is SavedPerson {
  return (
    isRecord(value) &&
    isString(value['id']) &&
    isString(value['name']) &&
    isArrayOf(value['statuses'], isString) &&
    (value['character'] === undefined || isString(value['character']))
  );
}

function isSelectionEntry(value: unknown): value is [string, number] {
  return Array.isArray(value) && value.length === 2 && isString(value[0]) && isCount(value[1]);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isArrayOf<T>(value: unknown, isItem: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(isItem);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isCount(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0;
}
