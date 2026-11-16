import { Character, GameSet, GroupType, SectionTitles } from '../character';

export class Maid extends Character {
  readonly id = 'maid';
  readonly name = 'The Devoted Maid';
  readonly group = GroupType.Passive;
  readonly game = GameSet.Characters;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        "Before the narrator reveals the card of a player the village has just voted out, the Devoted Maid may reveal themselves by turning their own card face up. The Maid then gives up that card and takes the eliminated player's character instead. The new character is not shown to the rest of the village, and it stays with the former Maid until they are eliminated or the game ends.",
    },
    {
      title: SectionTitles.attention,
      description:
        'A Maid who is one of the lovers does not get this choice. Love is stronger than the wish to change character.',
    },
    {
      title: SectionTitles.hintForTheNarrator,
      description:
        "Take your time before showing the village an eliminated player's card, so the Maid has room to reveal themselves. If they take on a character with a night ability, call them for it on the following nights, and on the first night after the swap prompt them quietly so they can settle into the role. Every special ability of the character the Maid takes over is refreshed and played as though it were the first night, and any effect that was on the eliminated player is cancelled.",
    },
    {
      title: SectionTitles.explanations,
      description:
        "The Maid inherits none of the following from the eliminated player: infection, being in love, enchantment, the office of Captain or Beadle, or Cupid's role. A Maid who was enchanted, Captain or Beadle stops being so. A Maid who was infected stays infected. A Maid who becomes the Piper is told by the narrator which players are already enchanted. A Maid who becomes the Juggler, the Beadle or the Gypsy gets no new cards dealt, and carries on with whichever cards are still unused.",
    },
  ];
}
