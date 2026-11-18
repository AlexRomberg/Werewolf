import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES, MEMBER_NAMES } from '../../i18n/names';
import { ActionButton, assignButton, filterFalsy, COMMON_LINES } from '../actions/action';
import { isFirstNight, NightContext } from '../actions/context';
import { isAlive } from '../../services/state/types';
import { BasePriority, Character, GameSet, GroupType } from '../character';

const BROTHER_COUNT = 3;

export class Brothers extends Character {
  readonly id = 'brothers';
  readonly name = CHARACTER_NAMES.brothers;
  override readonly memberName = MEMBER_NAMES.brothers;
  readonly group = GroupType.Active;
  readonly game = GameSet.Characters;
  override readonly hasMultiple = true;
  override readonly priority = BasePriority.Initial + 8;
  readonly description = CHARACTER_DESCRIPTIONS.brothers;

  override isAwakeThisNight(context: NightContext) {
    const canConfer = !this.isComplete(context) || context.assigned.filter(isAlive).length >= 2;
    return isFirstNight(context) || (context.round % 2 === 0 && canConfer);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [!this.isComplete(context) && COMMON_LINES.assignPeople, COMMON_LINES.mayExchange];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy([assignButton(context, BROTHER_COUNT)]);
  }

  private isComplete(context: NightContext) {
    return context.assigned.length >= BROTHER_COUNT;
  }
}
