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

export class WhiteWolf extends WerewolfCharacter {
  readonly id = 'white_wolf';
  readonly name = CHARACTER_NAMES.white_wolf;
  readonly group = GroupType.Wolves;
  readonly game = GameSet.Characters;
  override readonly priority = BasePriority.Wolf + 2;
  readonly description = CHARACTER_DESCRIPTIONS.white_wolf;

  override isAwakeThisNight(context: NightContext) {
    return context.round % 2 === 1;
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      !hasMarkedVictim(context, this.id) &&
        $localize`:@@white_wolf.mayKillOneWerewolf:May kill one werewolf`,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      assignButton(context),
      pickButton(
        'mark-victim',
        $localize`:@@white_wolf.markWerewolfVictim:Mark werewolf victim`,
        1,
        hasMarkedVictim(context, this.id),
      ),
    ]);
  }
}
