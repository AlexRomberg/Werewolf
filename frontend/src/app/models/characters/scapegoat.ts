import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { ActionButton, assignButton, filterFalsy, COMMON_LINES } from '../actions/action';
import { isAssigned, isFirstNight, NightContext } from '../actions/context';
import { BasePriority, Character, GameSet, GroupType } from '../character';

export class Scapegoat extends Character {
  readonly id = 'scapegoat';
  readonly name = CHARACTER_NAMES.scapegoat;
  readonly group = GroupType.Passive;
  readonly game = GameSet.NewMoon;
  override readonly priority = BasePriority.Initial + 12;
  readonly description = CHARACTER_DESCRIPTIONS.scapegoat;

  override isAwakeThisNight(context: NightContext) {
    return isFirstNight(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      COMMON_LINES.backToSleep,
      $localize`:@@scapegoat.isChosenWheneverAVote:Is chosen whenever a vote ends in a tie`,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy([assignButton(context)]);
  }
}
