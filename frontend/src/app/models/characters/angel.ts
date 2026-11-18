import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { NightContext } from '../actions/context';
import { Character, GameSet, GroupType } from '../character';

export class Angel extends Character {
  readonly id = 'angel';
  readonly name = CHARACTER_NAMES.angel;
  readonly group = GroupType.Loners;
  readonly game = GameSet.Characters;
  readonly description = CHARACTER_DESCRIPTIONS.angel;

  override getActions(_context: NightContext): (string | false)[] {
    return [
      $localize`:@@angel.opensWithADay:The game opens with a day, before the first night`,
      $localize`:@@angel.openTheDiscussion:Open the discussion`,
      $localize`:@@angel.holdTheVote:Hold the vote`,
    ];
  }
}
