import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import { ActionButton, assignButton, filterFalsy, COMMON_LINES } from '../actions/action';
import { isAbilityUsed, isAssigned, NightContext } from '../actions/context';
import { BasePriority, GameSet, GroupType } from '../character';
import { WerewolfCharacter } from '../werewolf-character';
import { Elder } from './elder';

export class PrimalWolf extends WerewolfCharacter {
  readonly id = 'primal_wolf';
  readonly name = CHARACTER_NAMES.primal_wolf;
  readonly group = GroupType.Wolves;
  readonly game = GameSet.Characters;
  override readonly priority = BasePriority.Wolf + 3;
  readonly description = CHARACTER_DESCRIPTIONS.primal_wolf;

  override isAwakeThisNight(_context: NightContext) {
    return true;
  }

  override getActions(context: NightContext): (string | false)[] {
    const hasInfected = isAbilityUsed(context, 'primal_wolf_infection');

    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      !hasInfected &&
        $localize`:@@primal_wolf.mayTurnTheVictimInto:May turn the victim into a werewolf`,
      !hasInfected &&
        this.isBitingTheElder(context) &&
        $localize`:@@primal_wolf.elderSurvivesTheBite:The Elder survives this bite and cannot be infected by it`,
      hasInfected && $localize`:@@primal_wolf.hasInfected:Has used the infection; call them anyway`,
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

  private isBitingTheElder(context: NightContext) {
    return (
      !isAbilityUsed(context, 'elder_life') &&
      context.victims.some((mark) =>
        context.people.some(
          (person) => person.id === mark.personId && person.character instanceof Elder,
        ),
      )
    );
  }
}
