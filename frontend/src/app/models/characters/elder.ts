import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { Character, GameSet, GroupType } from '../character';

export class Elder extends Character {
  readonly id = 'elder';
  readonly name = CHARACTER_NAMES.elder;
  readonly group = GroupType.Passive;
  readonly game = GameSet.NewMoon;
  readonly description = CHARACTER_DESCRIPTIONS.elder;
}
