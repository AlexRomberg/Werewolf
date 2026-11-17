import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import {
  ActionButton,
  assignButton,
  filterFalsy,
  pickButton,
  COMMON_LINES,
} from '../actions/action';
import { hasConnection, isAssigned, isFirstNight, NightContext } from '../actions/context';
import { ConnectionType } from '../../services/state/types';
import { BasePriority, Character, GameSet, GroupType } from '../character';

export class WildChild extends Character {
  readonly id = 'wild_child';
  readonly name = CHARACTER_NAMES.wild_child;
  readonly group = GroupType.Wolves;
  readonly game = GameSet.Characters;
  override readonly priority = BasePriority.Initial + 8;
  readonly description = CHARACTER_DESCRIPTIONS.wild_child;

  override isAwakeThisNight(context: NightContext) {
    return isFirstNight(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      !this.hasRoleModel(context) &&
        $localize`:@@wild_child.hasToChooseARole:Has to choose a role model`,
      $localize`:@@wild_child.turnsIntoAWerewolfIf:Turns into a werewolf if the role model dies`,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy([
      assignButton(context),
      isAssigned(context) &&
        pickButton(
          'set-role-model',
          $localize`:@@wild_child.assignTheRoleModel:Assign the role model`,
          1,
          this.hasRoleModel(context),
        ),
    ]);
  }

  private hasRoleModel(context: NightContext) {
    return hasConnection(context, ConnectionType.Trust);
  }
}
