import { ActionButton, assignButton, filterFalsy } from '../actions/action';
import { NightContext } from '../actions/context';
import { BasePriority, Character, GameSet, GroupType, SectionTitles } from '../character';

const SISTER_COUNT = 2;

export class Sisters extends Character {
  readonly id = 'sisters';
  readonly name = 'The Two Sisters';
  override readonly memberName = 'One of the Two Sisters';
  readonly group = GroupType.Active;
  readonly game = GameSet.Characters;
  override readonly hasMultiple = true;
  override readonly priority = BasePriority.Initial + 6;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'The Two Sisters are ordinary villagers and pull in the same direction as the rest of the village. The narrator calls them on the first night so they can recognise each other. With experienced groups they can be woken again now and then, every second night or whenever the narrator likes, to agree quietly on how to save the village.',
    },
    {
      title: SectionTitles.hintForTheNarrator,
      description:
        'The Two Sisters are a powerful thing in the hands of players who can sign to each other.',
    },
  ];

  override isAwakeThisNight(context: NightContext) {
    return context.round % 2 === 0;
  }

  override getActions(context: NightContext): (string | false)[] {
    return [!this.isComplete(context) && 'Assign people', 'They may exchange with each other'];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy([assignButton(context, SISTER_COUNT)]);
  }

  private isComplete(context: NightContext) {
    return context.assigned.length >= SISTER_COUNT;
  }
}
