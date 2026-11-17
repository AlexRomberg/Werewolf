import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { Character, GameSet, GroupType } from '../character';

export class Hunter extends Character {
  readonly id = 'hunter';
  readonly name = CHARACTER_NAMES.hunter;
  readonly group = GroupType.Passive;
  readonly game = GameSet.BaseGame;
  readonly description = CHARACTER_DESCRIPTIONS.hunter;
}
