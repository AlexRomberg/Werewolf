import { BasePriority, GameSets, GroupTypes, SectionTitles } from '../character';
import { WerewolfCharacter } from '../werewolf-character';

export class Werewolf extends WerewolfCharacter {
  readonly id = 'werewolf';
  readonly name = 'The Simple Werewolf';
  readonly group = GroupTypes.Wolves;
  readonly game = GameSets.BaseGame;
  override readonly hasMultiple = true;
  override readonly priority = BasePriority.Wolf + 1;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'Every night the werewolves devour a villager. By day they try to keep their true identity hidden. A werewolf may never devour another werewolf.',
    },
  ];

  override isAwakeThisNight(_round: number) {
    return true;
  }
}
