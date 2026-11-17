import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { Character, GameSet, GroupType } from '../character';

export class SmallChild extends Character {
  readonly id = 'small_child';
  readonly name = CHARACTER_NAMES.small_child;
  readonly group = GroupType.Active;
  readonly game = GameSet.BaseGame;
  readonly description = CHARACTER_DESCRIPTIONS.small_child;
}
