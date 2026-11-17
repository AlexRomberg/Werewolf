import { ActionButton, assignButton, filterFalsy, pickButton } from '../actions/action';
import { hasMarkedVictim, isAssigned, NightContext } from '../actions/context';
import { BasePriority, GameSet, GroupType, SectionTitles } from '../character';
import { WerewolfCharacter } from '../werewolf-character';

export class WhiteWolf extends WerewolfCharacter {
  readonly id = 'white_wolf';
  readonly name = 'The White Wolf';
  readonly group = GroupType.Wolves;
  readonly game = GameSet.Characters;
  override readonly priority = BasePriority.Wolf + 2;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'The White Wolf hates the werewolves as much as the villagers. Every night they wake with the pack and help pick a victim from the village. Every second night, though, the narrator calls the White Wolf alone in a phase of their own, and they may kill one werewolf if they wish. They may not take a second villager. The White Wolf wins only by being the last player left alive.',
    },
  ];

  override isAwakeThisNight(context: NightContext) {
    return context.round % 2 === 1;
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && 'Assign person',
      !hasMarkedVictim(context, this.id) && 'May kill one werewolf',
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      assignButton(context),
      pickButton('mark-victim', 'Mark werewolf victim', 1, hasMarkedVictim(context, this.id)),
    ]);
  }
}
