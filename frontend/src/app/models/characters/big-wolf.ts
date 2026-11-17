import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import {
  ActionButton,
  assignButton,
  filterFalsy,
  pickButton,
  COMMON_LINES,
} from '../actions/action';
import { hasMarkedVictim, isAssigned, NightContext } from '../actions/context';
import { BasePriority, GameSet, GroupType } from '../character';
import { WerewolfCharacter } from '../werewolf-character';

export class BigWolf extends WerewolfCharacter {
  readonly id = 'big_wolf';
  readonly name = CHARACTER_NAMES.big_wolf;
  readonly group = GroupType.Wolves;
  readonly game = GameSet.Characters;
  override readonly priority = BasePriority.Wolf + 4;
  readonly description = CHARACTER_DESCRIPTIONS.big_wolf;

  override isAwakeThisNight(context: NightContext) {
    return !this.hasLostAWolf(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      !hasMarkedVictim(context, this.id) &&
        $localize`:@@big_wolf.mayPickASecondVictim:May pick a second victim`,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      assignButton(context),
      pickButton(
        'mark-victim',
        $localize`:@@big_wolf.markSecondVictim:Mark second victim`,
        1,
        hasMarkedVictim(context, this.id),
      ),
    ]);
  }
}
