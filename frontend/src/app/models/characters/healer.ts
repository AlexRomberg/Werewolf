import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import {
  ActionButton,
  assignButton,
  filterFalsy,
  pickButton,
  COMMON_LINES,
} from '../actions/action';
import { isAssigned, NightContext, someoneHas } from '../actions/context';
import { PersonStatus } from '../../services/state/types';
import { BasePriority, Character, GameSet, GroupType } from '../character';

export class Healer extends Character {
  readonly id = 'healer';
  readonly name = CHARACTER_NAMES.healer;
  readonly group = GroupType.Active;
  readonly game = GameSet.NewMoon;
  override readonly priority = BasePriority.Initial + 10;
  readonly description = CHARACTER_DESCRIPTIONS.healer;

  override isAwakeThisNight(_context: NightContext) {
    return true;
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      !this.hasProtected(context) &&
        $localize`:@@healer.mayMakeOnePlayerImmortal:May make one player immortal for this night`,
      this.hasProtected(context) && COMMON_LINES.finishedForTheNight,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      assignButton(context),
      pickButton(
        'protect',
        $localize`:@@healer.protectAPlayer:Protect a player`,
        1,
        this.hasProtected(context),
      ),
    ]);
  }

  private hasProtected(context: NightContext) {
    return someoneHas(context, PersonStatus.Protected);
  }
}
