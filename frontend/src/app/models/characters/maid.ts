import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { Character, GameSet, GroupType } from '../character';

export class Maid extends Character {
  readonly id = 'maid';
  readonly name = CHARACTER_NAMES.maid;
  readonly group = GroupType.Passive;
  readonly game = GameSet.Characters;
  readonly description = CHARACTER_DESCRIPTIONS.maid;
}
