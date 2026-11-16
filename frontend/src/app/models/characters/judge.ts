import { ActionButton, assignButton, filterFalsy } from '../actions/action';
import { isAssigned, isFirstNight, NightContext } from '../actions/context';
import { BasePriority, Character, GameSet, GroupType, SectionTitles } from '../character';

export class Judge extends Character {
  readonly id = 'judge';
  readonly name = 'The Stuttering Judge';
  readonly group = GroupType.Passive;
  readonly game = GameSet.Characters;
  override readonly priority = BasePriority.Initial + 14;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'Once per game the Stuttering Judge may call for a second vote on the same day, with a second victim. They signal this to the narrator during the first vote, using a sign the two of them agreed beforehand. The second vote follows immediately, with no further discussion. The sign itself is agreed with the narrator when the Judge is called on the first night.',
    },
    {
      title: SectionTitles.hintForTheNarrator,
      description: 'Watch the Stuttering Judge closely so you do not miss the sign.',
    },
  ];

  override isAwakeThisNight(context: NightContext) {
    return isFirstNight(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && 'Assign person',
      'Has to agree a sign with the narrator',
      'May call for a second vote by giving the sign',
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy([assignButton(context)]);
  }
}
