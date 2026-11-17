import { Character, GameSet, GroupType, SectionTitles } from '../character';

export class VillageIdiot extends Character {
  readonly id = 'village_idiot';
  readonly name = 'The Village Idiot';
  readonly group = GroupType.Passive;
  readonly game = GameSet.NewMoon;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'What village does not have its idiot? They make a nuisance of themselves, but they are so likeable that nobody could bring themselves to do them harm. If the village votes the Village Idiot out, the Idiot turns their card over, the villagers see their mistake and pardon them on the spot. The Idiot plays on but loses the right to vote from then on, because who listens to an idiot anyway, and there is no fresh vote that day. The pardon only covers the village vote. If the werewolves take the Idiot, or the Hunter shoots them, they are eliminated like anyone else, and if the Idiot was Captain, the office is lost for good.',
    },
  ];
}
