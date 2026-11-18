import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { ActionButton, assignButton, filterFalsy, COMMON_LINES } from '../actions/action';
import { isAssigned, isFirstNight, NightContext } from '../actions/context';
import { BasePriority, Character, GameSet, GroupType } from '../character';

export class Thief extends Character {
  readonly id = 'thief';
  readonly name = CHARACTER_NAMES.thief;
  readonly group = GroupType.Active;
  readonly game = GameSet.BaseGame;
  override readonly priority = BasePriority.Initial + 1;
  readonly description = CHARACTER_DESCRIPTIONS.thief;

  override isAwakeThisNight(context: NightContext) {
    return isFirstNight(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      $localize`:@@thief.maySwapCards:May swap their card for one of the two middle cards (must, if both are werewolves)`,
      context.leftover.length > 0 &&
        $localize`:@@thief.middleCards:Middle cards: ${context.leftover.map((card) => card.name).join(', ')}:cards:`,
      !isAssigned(context) && COMMON_LINES.assignPerson,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy([assignButton(context)]);
  }
}
