import { BasePriority, GameSets, GroupTypes, SectionTitles } from '../character';
import { WerewolfCharacter } from '../werewolf-character';

export class BigWolf extends WerewolfCharacter {
  readonly id = 'big_wolf';
  readonly name = 'The Big Bad Wolf';
  readonly group = GroupTypes.Wolves;
  readonly game = GameSets.Characters;
  override readonly priority = BasePriority.Wolf + 4;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'Each night the Big Bad Wolf wakes with the other wolves and helps choose a victim. Then, as long as no werewolf has been eliminated, including the Wild Child or the Wolfdog once they have turned, the Big Bad Wolf wakes a second time alone, straight after the wolf phase, and chooses another victim. They may not devour a werewolf.',
    },
  ];

  override isAwakeThisNight(_round: number) {
    // TODO (ARO): sleeps once a werewolf has died
    return true;
  }
}
