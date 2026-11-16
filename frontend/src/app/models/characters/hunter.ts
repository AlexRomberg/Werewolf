import { Character, GameSet, GroupType, SectionTitles } from '../character';

export class Hunter extends Character {
  readonly id = 'hunter';
  readonly name = 'The Hunter';
  readonly group = GroupType.Passive;
  readonly game = GameSet.BaseGame;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'If the Hunter is devoured by the werewolves or executed by the village, they get one shot before they go. They name any player, and that player is eliminated as well.',
    },
    {
      title: SectionTitles.specialCase,
      description:
        'If the Hunter is in love with a player who is eliminated, they may still name someone before dying of grief, and that player is eliminated too. This can end with nobody left alive at all, in which case no side has won.',
    },
  ];
}
