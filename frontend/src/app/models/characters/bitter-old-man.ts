import { ActionButton, assignButton, filterFalsy } from '../actions/action';
import { isAssigned, isFirstNight, NightContext } from '../actions/context';
import { BasePriority, Character, GameSet, GroupType, SectionTitles } from '../character';

export class BitterOldMan extends Character {
  readonly id = 'bitter_old_man';
  readonly name = 'The Bitter Old Man';
  readonly group = GroupType.Loners;
  readonly game = GameSet.NewMoon;
  override readonly priority = BasePriority.Initial + 13;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'Before the game starts, the narrator splits the village into two groups and announces the split out loud, going by something obvious: gender, glasses, height, age, a beard. The Bitter Old Man has to fall clearly into one of the two groups. They win the game alone, and only this way, if every player in the other group is eliminated. No special ability helps them do it. Talk and manipulation are their only weapons.',
    },
    {
      title: SectionTitles.hintForTheNarrator,
      description:
        'The two groups do not have to be the same size. If anyone looks unsure, tell every player plainly which group they are in.',
    },
  ];

  override isAwakeThisNight(context: NightContext) {
    return isFirstNight(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && 'Assign person',
      'Can go back to sleep right away',
      'Belongs to one half of the players and tries to eliminate the other half',
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy([assignButton(context)]);
  }
}
