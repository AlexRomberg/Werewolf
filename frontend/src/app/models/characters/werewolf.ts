import { ActionButton, assignButton, filterFalsy, pickButton } from '../actions/action';
import { hasMarkedVictim, isAssigned, NightContext } from '../actions/context';
import { BasePriority, GameSet, GroupType, SectionTitles } from '../character';
import { WerewolfCharacter } from '../werewolf-character';

export class Werewolf extends WerewolfCharacter {
  readonly id = 'werewolf';
  readonly name = 'The Simple Werewolf';
  readonly group = GroupType.Wolves;
  readonly game = GameSet.BaseGame;
  override readonly hasMultiple = true;
  override readonly priority = BasePriority.Wolf + 1;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'Every night the werewolves devour a villager. By day they try to keep their true identity hidden. A werewolf may never devour another werewolf.',
    },
  ];

  override isAwakeThisNight(_context: NightContext) {
    return true;
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && 'Assign the wolves',
      !hasMarkedVictim(context, this.id) && 'They have to settle on a victim',
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      assignButton(context),
      pickButton('mark-victim', 'Mark victim', 1, hasMarkedVictim(context, this.id)),
    ]);
  }
}
