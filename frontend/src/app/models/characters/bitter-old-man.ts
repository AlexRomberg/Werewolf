import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { ActionButton, assignButton, filterFalsy, COMMON_LINES } from '../actions/action';
import { isAssigned, isFirstNight, NightContext } from '../actions/context';
import { BasePriority, Character, GameSet, GroupType } from '../character';

export class BitterOldMan extends Character {
  readonly id = 'bitter_old_man';
  readonly name = CHARACTER_NAMES.bitter_old_man;
  readonly group = GroupType.Loners;
  readonly game = GameSet.NewMoon;
  override readonly priority = BasePriority.Initial + 13;
  readonly description = CHARACTER_DESCRIPTIONS.bitter_old_man;

  override isAwakeThisNight(context: NightContext) {
    return isFirstNight(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      COMMON_LINES.backToSleep,
      $localize`:@@bitter_old_man.belongsToOneHalfOf:Belongs to one half of the players and tries to eliminate the other half`,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy([assignButton(context)]);
  }
}
