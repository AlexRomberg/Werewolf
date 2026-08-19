import { Character, GameSets, GroupTypes, SectionTitles } from '../character';

export class Wolfdog extends Character {
  readonly id = 'wolfdog';
  readonly name = 'The Wolfdog';
  readonly group = GroupTypes.Wolves;
  readonly game = GameSets.Characters;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'On the first night the Wolfdog decides which side to play on: Simple Villager or Simple Werewolf. If they choose the wolves, they simply open their eyes with the rest of the pack during the wolf phase and hunt with them. Otherwise they keep their eyes shut and play for the village. The choice is final and holds for the rest of the game.',
    },
    {
      title: SectionTitles.hintForTheNarrator,
      description:
        "As with the Wild Child, it adds to the tension to keep the Wolfdog's true identity secret if the village votes them out, so nobody knows whether a villager or a werewolf was eliminated.",
    },
  ];
}
