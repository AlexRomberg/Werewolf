import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { ActionButton, assignButton, filterFalsy, COMMON_LINES } from '../actions/action';
import { isAssigned, NightContext } from '../actions/context';
import { BasePriority, Character, GameSet, GroupType } from '../character';

export class Juggler extends Character {
  readonly id = 'juggler';
  readonly name = CHARACTER_NAMES.juggler;
  readonly group = GroupType.Active;
  readonly game = GameSet.Characters;
  override readonly priority = BasePriority.Initial + 2;
  readonly description = CHARACTER_DESCRIPTIONS.juggler;

  override isAwakeThisNight(_context: NightContext) {
    return true;
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      $localize`:@@juggler.mayChooseARole:May choose one of the displayed roles to play until the next night`,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy([assignButton(context)]);
  }
}
