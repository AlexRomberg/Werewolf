import { ActionButton, assignButton, filterFalsy } from '../actions/action';
import { isAbilityUsed, isAssigned, NightContext } from '../actions/context';
import { BasePriority, GameSet, GroupType, SectionTitles } from '../character';
import { WerewolfCharacter } from '../werewolf-character';

export class PrimalWolf extends WerewolfCharacter {
  readonly id = 'primal_wolf';
  readonly name = 'The Primal Wolf';
  readonly group = GroupType.Wolves;
  readonly game = GameSet.Characters;
  override readonly priority = BasePriority.Wolf + 3;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        "Each night the Primal Wolf wakes with the other wolves and helps choose a victim. Once the wolves are asleep again, the Primal Wolf may signal to the narrator that they want to infect that night's victim. This works only once per game. The narrator touches the infected player, who becomes a werewolf on the spot and from the next night on wakes with the pack to hunt. If that player has a night ability of their own, they still wake for it when called, on top of the wolf phase.",
    },
  ];

  override isAwakeThisNight(context: NightContext) {
    return !isAbilityUsed(context, 'primal_wolf_infection') && !this.hasLostAWolf(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [!isAssigned(context) && 'Assign person', 'May turn the victim into a werewolf'];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      assignButton(context),
      !isAbilityUsed(context, 'primal_wolf_infection') && {
        kind: 'infect',
        label: 'Turn the victim into a werewolf',
      },
    ]);
  }
}
