import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { Character, GameSet, GroupType } from '../character';

export class VillageIdiot extends Character {
  readonly id = 'village_idiot';
  readonly name = CHARACTER_NAMES.village_idiot;
  readonly group = GroupType.Passive;
  readonly game = GameSet.NewMoon;
  readonly description = CHARACTER_DESCRIPTIONS.village_idiot;
}
