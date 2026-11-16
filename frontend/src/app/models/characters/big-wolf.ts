import { ActionButton, assignButton, filterFalsy, pickButton } from '../actions/action';
import { hasMarkedVictim, isAssigned, NightContext } from '../actions/context';
import { BasePriority, GameSet, GroupType, SectionTitles } from '../character';
import { WerewolfCharacter } from '../werewolf-character';

export class BigWolf extends WerewolfCharacter {
  readonly id = 'big_wolf';
  readonly name = 'The Big Bad Wolf';
  readonly group = GroupType.Wolves;
  readonly game = GameSet.Characters;
  override readonly priority = BasePriority.Wolf + 4;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'Each night the Big Bad Wolf wakes with the other wolves and helps choose a victim. Then, as long as no werewolf has been eliminated, including the Wild Child or the Wolfdog once they have turned, the Big Bad Wolf wakes a second time alone, straight after the wolf phase, and chooses another victim. They may not devour a werewolf.',
    },
  ];

  override isAwakeThisNight(context: NightContext) {
    return !this.hasLostAWolf(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && 'Assign person',
      !hasMarkedVictim(context, this.id) && 'May pick a second victim',
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      assignButton(context),
      pickButton('mark-victim', 'Mark second victim', 1, hasMarkedVictim(context, this.id)),
    ]);
  }
}
