import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { Character, GameSet, GroupType } from '../character';

export class Angel extends Character {
  readonly id = 'angel';
  readonly name = CHARACTER_NAMES.angel;
  readonly group = GroupType.Loners;
  readonly game = GameSet.Characters;
  readonly description = CHARACTER_DESCRIPTIONS.angel;
}
