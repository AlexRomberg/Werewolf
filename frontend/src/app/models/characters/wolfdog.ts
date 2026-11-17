import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { Character, GameSet, GroupType } from '../character';

export class Wolfdog extends Character {
  readonly id = 'wolfdog';
  readonly name = CHARACTER_NAMES.wolfdog;
  readonly group = GroupType.Wolves;
  readonly game = GameSet.Characters;
  readonly description = CHARACTER_DESCRIPTIONS.wolfdog;
}
