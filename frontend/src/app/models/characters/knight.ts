import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { Character, GameSet, GroupType } from '../character';

export class Knight extends Character {
  readonly id = 'knight';
  readonly name = CHARACTER_NAMES.knight;
  readonly group = GroupType.Passive;
  readonly game = GameSet.Characters;
  readonly description = CHARACTER_DESCRIPTIONS.knight;
}
