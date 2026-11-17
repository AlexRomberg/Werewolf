import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { Character, GameSet, GroupType } from '../character';

export class Villager extends Character {
  readonly id = 'villager';
  readonly name = CHARACTER_NAMES.villager;
  readonly group = GroupType.Passive;
  readonly game = GameSet.BaseGame;
  override readonly hasMultiple = true;
  readonly description = CHARACTER_DESCRIPTIONS.villager;
}
