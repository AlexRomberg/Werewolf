import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { ActionButton, assignButton, filterFalsy, COMMON_LINES } from '../actions/action';
import { isAbilityUsed, isAssigned, NightContext } from '../actions/context';
import { BasePriority, GameSet, GroupType } from '../character';
import { WerewolfCharacter } from '../werewolf-character';

export class PrimalWolf extends WerewolfCharacter {
  readonly id = 'primal_wolf';
  readonly name = CHARACTER_NAMES.primal_wolf;
  readonly group = GroupType.Wolves;
  readonly game = GameSet.Characters;
  override readonly priority = BasePriority.Wolf + 3;
  readonly description = CHARACTER_DESCRIPTIONS.primal_wolf;

  override isAwakeThisNight(context: NightContext) {
    return !isAbilityUsed(context, 'primal_wolf_infection') && !this.hasLostAWolf(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      $localize`:@@primal_wolf.mayTurnTheVictimInto:May turn the victim into a werewolf`,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      assignButton(context),
      !isAbilityUsed(context, 'primal_wolf_infection') && {
        kind: 'infect',
        label: $localize`:@@primal_wolf.turnTheVictimIntoA:Turn the victim into a werewolf`,
      },
    ]);
  }
}
