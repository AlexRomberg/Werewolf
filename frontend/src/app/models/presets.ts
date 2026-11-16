import { Character, copiesOf } from './character';
import { CHARACTERS_BY_ID } from './characters';

export interface Preset {
  readonly name: string;
  readonly cards: Readonly<Record<string, number>>;
}

export const PRESETS: readonly Preset[] = [
  {
    name: 'Small Group',
    cards: { werewolf: 1, wild_child: 1, seer: 1, healer: 1 },
  },
  {
    name: 'First Game',
    cards: { werewolf: 2, seer: 1, witch: 1, hunter: 1, villager: 1 },
  },
  {
    name: 'Classic Village',
    cards: { werewolf: 2, seer: 1, witch: 1, hunter: 1, cupid: 1, small_child: 1, villager: 2 },
  },
  {
    name: 'Complex Game',
    cards: {
      werewolf: 1,
      primal_wolf: 1,
      wild_child: 1,
      cupid: 1,
      witch: 1,
      hoodrat: 1,
      healer: 1,
      fox: 1,
      seer: 1,
    },
  },
  {
    name: 'Big Table',
    cards: {
      werewolf: 3,
      big_wolf: 1,
      seer: 1,
      witch: 1,
      hunter: 1,
      cupid: 1,
      healer: 1,
      fox: 1,
      brothers: 3,
      elder: 1,
    },
  },
  {
    name: 'All Characters',
    cards: {
      angel: 1,
      bear_tamer: 1,
      big_wolf: 1,
      bitter_old_man: 1,
      brothers: 1,
      cupid: 1,
      elder: 1,
      fox: 1,
      healer: 1,
      hoodrat: 1,
      hunter: 1,
      juggler: 1,
      knight: 1,
      maid: 1,
      piper: 1,
      primal_wolf: 1,
      scapegoat: 1,
      seer: 1,
      sisters: 1,
      small_child: 1,
      thief: 1,
      villager: 1,
      village_idiot: 1,
      werewolf: 1,
      white_wolf: 1,
      wild_child: 1,
      witch: 1,
      wolfdog: 1,
    },
  },
];

export function presetEntries(preset: Preset): [Character, number][] {
  return Object.entries(preset.cards).map(([id, amount]) => {
    const character = CHARACTERS_BY_ID.get(id);
    if (!character) {
      throw new Error(`Preset "${preset.name}" has an unknown character: ${id}`);
    }

    return [character, amount];
  });
}

export function presetDeck(preset: Preset): Character[] {
  return presetEntries(preset).flatMap(([character, amount]) => copiesOf(character, amount));
}
