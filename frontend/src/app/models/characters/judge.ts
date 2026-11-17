import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { ActionButton, assignButton, filterFalsy, COMMON_LINES } from '../actions/action';
import { isAssigned, isFirstNight, NightContext } from '../actions/context';
import { BasePriority, Character, GameSet, GroupType } from '../character';

export class Judge extends Character {
  readonly id = 'judge';
  readonly name = CHARACTER_NAMES.judge;
  readonly group = GroupType.Passive;
  readonly game = GameSet.Characters;
  override readonly priority = BasePriority.Initial + 14;
  readonly description = CHARACTER_DESCRIPTIONS.judge;

  override isAwakeThisNight(context: NightContext) {
    return isFirstNight(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      $localize`:@@judge.hasToAgreeASign:Has to agree a sign with the narrator`,
      $localize`:@@judge.mayCallForASecond:May call for a second vote by giving the sign`,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy([assignButton(context)]);
  }
}
