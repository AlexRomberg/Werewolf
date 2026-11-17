import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { ActionButton, assignButton, filterFalsy, COMMON_LINES } from '../actions/action';
import { isAssigned, isFirstNight, NightContext } from '../actions/context';
import { BasePriority, Character, GameSet, GroupType } from '../character';

export class BearTamer extends Character {
  readonly id = 'bear_tamer';
  readonly name = CHARACTER_NAMES.bear_tamer;
  readonly group = GroupType.Passive;
  readonly game = GameSet.Characters;
  override readonly priority = BasePriority.Initial + 9;
  readonly description = CHARACTER_DESCRIPTIONS.bear_tamer;

  override isAwakeThisNight(context: NightContext) {
    return isFirstNight(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      $localize`:@@bear_tamer.ifTheySitNextTo:If they sit next to a werewolf or are infected, tell the village in the morning`,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy([assignButton(context)]);
  }
}
