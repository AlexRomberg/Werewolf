import { BasePriority, Character, GameSets, GroupTypes, SectionTitles } from '../character';

export class Sisters extends Character {
  readonly id = 'sisters';
  readonly name = 'The Two Sisters';
  readonly group = GroupTypes.Active;
  readonly game = GameSets.Characters;
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

  override isAwakeThisNight(round: number) {
    return round % 2 === 0;
  }
}
