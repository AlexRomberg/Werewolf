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

export class Cupid extends Character {
  readonly id = 'cupid';
  readonly name = CHARACTER_NAMES.cupid;
  readonly group = GroupType.Active;
  readonly game = GameSet.BaseGame;
  override readonly priority = BasePriority.Initial + 3;
  readonly description = CHARACTER_DESCRIPTIONS.cupid;

  override isAwakeThisNight(context: NightContext) {
    return isFirstNight(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      !this.hasCouple(context) && $localize`:@@cupid.hasToPickACouple:Has to pick a couple`,
      $localize`:@@cupid.theCoupleHasToWake:The couple has to wake up`,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      assignButton(context),
      pickButton(
        'pair-lovers',
        $localize`:@@cupid.assignTheCouple:Assign the couple`,
        2,
        this.hasCouple(context),
      ),
    ]);
  }

  private hasCouple(context: NightContext) {
    return hasConnection(context, ConnectionType.Love);
  }
}
