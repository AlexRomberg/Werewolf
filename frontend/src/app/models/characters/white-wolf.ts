import { BasePriority, GameSets, GroupTypes, SectionTitles } from '../character';
import { WerewolfCharacter } from '../werewolf-character';

export class WhiteWolf extends WerewolfCharacter {
  readonly id = 'white_wolf';
  readonly name = 'The White Wolf';
  readonly group = GroupTypes.Wolves;
  readonly game = GameSets.Characters;
  override readonly priority = BasePriority.Wolf + 2;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'The White Wolf hates the werewolves as much as the villagers. Every night they wake with the pack and help pick a victim from the village. Every second night, though, the narrator calls the White Wolf alone in a phase of their own, and they may kill one werewolf if they wish. They may not take a second villager. The White Wolf wins only by being the last player left alive.',
    },
  ];

  override isAwakeThisNight(round: number) {
    return round % 2 === 1;
  }
}
