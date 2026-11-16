import { ActionButton, assignCard } from '../actions/action';
import { NightContext } from '../actions/context';
import { BasePriority, Character, GameSets, GroupTypes, SectionTitles } from '../character';

export class Brothers extends Character {
  readonly id = 'brothers';
  readonly name = 'The Three Brothers';
  override readonly memberName = 'One of the Three Brothers';
  readonly group = GroupTypes.Active;
  readonly game = GameSets.Characters;
  override readonly hasMultiple = true;
  override readonly priority = BasePriority.Initial + 7;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'The Three Brothers are ordinary villagers and pull in the same direction as the rest of the village. On the first night the narrator calls them so they can learn who the others are. With experienced groups the narrator can wake them again now and then, every second night or whenever it suits, to let them agree quietly on what to do next.',
    },
    {
      title: SectionTitles.hintForTheNarrator,
      description:
        'Like the Two Sisters, the Three Brothers are a powerful thing in the hands of players who can sign to each other. Use them only in large groups. In very large ones it is worth adding the Two Sisters as well.',
    },
  ];

  override isAwakeThisNight(context: NightContext) {
    return context.round % 2 === 0;
  }

  override getActions(context: NightContext): (string | false)[] {
    return [!this.isComplete(context) && 'Assign people', 'They may exchange with each other'];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return this.isComplete(context) ? [] : [assignCard(context, 3)];
  }

  private isComplete(context: NightContext) {
    return context.assigned.length === 3;
  }
}
