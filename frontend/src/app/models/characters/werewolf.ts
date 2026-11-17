import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { ActionButton, assignButton, filterFalsy, pickButton } from '../actions/action';
import { hasMarkedVictim, isAssigned, NightContext } from '../actions/context';
import { BasePriority, GameSet, GroupType } from '../character';
import { WerewolfCharacter } from '../werewolf-character';

export class Werewolf extends WerewolfCharacter {
  readonly id = 'werewolf';
  readonly name = CHARACTER_NAMES.werewolf;
  readonly group = GroupType.Wolves;
  readonly game = GameSet.BaseGame;
  override readonly hasMultiple = true;
  override readonly priority = BasePriority.Wolf + 1;
  readonly description = CHARACTER_DESCRIPTIONS.werewolf;

  override isAwakeThisNight(_context: NightContext) {
    return true;
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && $localize`:@@werewolf.assignTheWolves:Assign the wolves`,
      !hasMarkedVictim(context, this.id) &&
        $localize`:@@werewolf.theyHaveToSettleOn:They have to settle on a victim`,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      assignButton(context),
      pickButton(
        'mark-victim',
        $localize`:@@werewolf.markVictim:Mark victim`,
        1,
        hasMarkedVictim(context, this.id),
      ),
    ]);
  }
}
