import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import {
  ActionButton,
  assignButton,
  filterFalsy,
  pickButton,
  COMMON_LINES,
} from '../actions/action';
import { isAssigned, NightContext } from '../actions/context';
import { BasePriority, Character, GameSet, GroupType } from '../character';

export class Piper extends Character {
  readonly id = 'piper';
  readonly name = CHARACTER_NAMES.piper;
  readonly group = GroupType.Loners;
  readonly game = GameSet.NewMoon;
  override readonly priority = BasePriority.PostWolf + 2;
  readonly description = CHARACTER_DESCRIPTIONS.piper;

  override isAwakeThisNight(_context: NightContext) {
    return true;
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      $localize`:@@piper.mayEnchantTwoPlayers:May enchant two players`,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      assignButton(context),
      pickButton(
        'enchant',
        $localize`:@@piper.enchantTwoPlayers:Enchant two players`,
        2,
        context.roles.enchantedTonight.length > 0,
      ),
    ]);
  }
}
