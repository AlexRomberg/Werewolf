import { ActionButton, assignButton, filterFalsy } from '../actions/action';
import { isAssigned, NightContext } from '../actions/context';
import { BasePriority, Character, GameSet, GroupType, SectionTitles } from '../character';

export class Seer extends Character {
  readonly id = 'seer';
  readonly name = 'The Seer';
  readonly group = GroupType.Active;
  readonly game = GameSet.BaseGame;
  override readonly priority = BasePriority.Initial + 4;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'Each night the Seer learns the true identity of one player of their choice. They have to help the rest of the village with what they know without giving themselves away, or the werewolves will find them.',
    },
  ];

  override isAwakeThisNight(_context: NightContext) {
    return true;
  }

  override getActions(context: NightContext): (string | false)[] {
    return [!isAssigned(context) && 'Assign person', 'May look at one card'];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy([assignButton(context)]);
  }
}
