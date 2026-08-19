import { Character, GameSets, GroupTypes, SectionTitles } from '../character';

export class Angel extends Character {
  readonly id = 'angel';
  readonly name = 'The Angel';
  readonly group = GroupTypes.Loners;
  readonly game = GameSets.Characters;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        "When the Angel is in play, the game opens with a day and its vote, before the first night falls and before any special character is called. If the Angel draws the village's suspicion in that vote, or is devoured by the werewolves during the first night, they win the game outright and the narrator may start a new round straight away. If they survive both, the Angel becomes an ordinary villager for the rest of the game.",
    },
    {
      title: SectionTitles.hintForTheNarrator,
      description:
        'Do not be shy about reminding the village that the Angel might be among them. The first discussion is livelier for it, and a smooth talker has a heavenly threat to hide behind.',
    },
  ];
}
