import { Character, GAME_SET_LABELS, GROUP_LABELS } from '../character';
import { BULK_CHARACTERS, CHARACTERS } from './index';

export type CharacterGrouping = 'group' | 'game';

export interface CharacterSection {
  label: string;
  characters: readonly Character[];
}

export function characterSections(grouping: CharacterGrouping): CharacterSection[] {
  return grouping === 'group'
    ? sectionsBy(GROUP_LABELS, (character) => character.group)
    : sectionsBy(GAME_SET_LABELS, (character) => character.game);
}

function sectionsBy<T>(labels: ReadonlyMap<T, string>, keyOf: (character: Character) => T) {
  const isBulk = (character: Character) => BULK_CHARACTERS.includes(character);

  return [...labels].map(([key, label]) => {
    const inSection = CHARACTERS.filter((character) => keyOf(character) === key);
    return {
      label,
      characters: [...inSection.filter(isBulk), ...inSection.filter((c) => !isBulk(c))],
    };
  });
}
