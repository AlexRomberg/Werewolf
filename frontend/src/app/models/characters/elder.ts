import { Character, GameSet, GroupType, SectionTitles } from '../character';

export class Elder extends Character {
  readonly id = 'elder';
  readonly name = 'The Elder';
  readonly group = GroupType.Passive;
  readonly game = GameSet.Characters;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        "The Elder has come through every trial life could throw at them and is harder to kill than anyone else in the village. The werewolves have to choose them twice. The first time the wolves tear into them, the Elder survives and the narrator does not turn their card over. The Primal Wolf cannot infect them with that first bite either. Only a second attack eliminates them. A village vote, the Witch's poison, the Hunter's shot or the Barber's razor all take the Elder at the first attempt, and if they go that way the villagers lose their special abilities in despair at having killed so learned an elder.",
    },
    {
      title: SectionTitles.attention,
      description: 'If the Witch heals the Elder, they get only one life back.',
    },
    {
      title: SectionTitles.variantForTheBrave,
      description:
        'If the Village Idiot has already been revealed, the Idiot is eliminated along with the Elder. The village, having lost its wisdom, goes back on the decision to spare the Idiot.',
    },
  ];
}
