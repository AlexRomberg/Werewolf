import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { ActionButton, assignButton, filterFalsy, COMMON_LINES } from '../actions/action';
import { isAbilityUsed, isAssigned, NightContext } from '../actions/context';
import { BasePriority, Character, GameSet, GroupType } from '../character';

export class Fox extends Character {
  readonly id = 'fox';
  readonly name = CHARACTER_NAMES.fox;
  readonly group = GroupType.Active;
  readonly game = GameSet.Characters;
  override readonly priority = BasePriority.Initial + 5;
  readonly description = CHARACTER_DESCRIPTIONS.fox;

  override isAwakeThisNight(context: NightContext) {
    return !this.hasMissed(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      !this.hasMissed(context) &&
        $localize`:@@fox.mayPointAtAPlayer:May point at a player; confirm if they or one of their neighbours is a werewolf`,
      this.hasMissed(context) &&
        $localize`:@@fox.hasMissedAndWillNot:Has missed and will not wake up again from tomorrow night`,
      $localize`:@@fox.neverShowTheThreeCards:Never show the three cards`,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      assignButton(context),
      {
        kind: 'lose-fox-request',
        label: $localize`:@@fox.hasMissed:Has missed`,
        done: this.hasMissed(context),
      },
    ]);
  }

  private hasMissed(context: NightContext) {
    return isAbilityUsed(context, 'fox_request');
  }
}
