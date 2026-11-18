import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES, MEMBER_NAMES } from '../../i18n/names';
import { ActionButton, assignButton, filterFalsy, COMMON_LINES } from '../actions/action';
import { isFirstNight, NightContext } from '../actions/context';
import { isAlive } from '../../services/state/types';
import { BasePriority, Character, GameSet, GroupType } from '../character';

const SISTER_COUNT = 2;

export class Sisters extends Character {
  readonly id = 'sisters';
  readonly name = CHARACTER_NAMES.sisters;
  override readonly memberName = MEMBER_NAMES.sisters;
  readonly group = GroupType.Active;
  readonly game = GameSet.Characters;
  override readonly hasMultiple = true;
  override readonly priority = BasePriority.Initial + 7;
  readonly description = CHARACTER_DESCRIPTIONS.sisters;

  override isAwakeThisNight(context: NightContext) {
    const canConfer = !this.isComplete(context) || context.assigned.filter(isAlive).length >= 2;
    return isFirstNight(context) || (context.round % 2 === 0 && canConfer);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [!this.isComplete(context) && COMMON_LINES.assignPeople, COMMON_LINES.mayExchange];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy([assignButton(context, SISTER_COUNT)]);
  }

  private isComplete(context: NightContext) {
    return context.assigned.length >= SISTER_COUNT;
  }
}
