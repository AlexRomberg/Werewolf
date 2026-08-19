import { BasePriority, Character, GameSets, GroupTypes, SectionTitles } from '../character';

export class BearTamer extends Character {
  readonly id = 'bear_tamer';
  readonly name = 'The Bear Tamer';
  readonly group = GroupTypes.Passive;
  readonly game = GameSets.Characters;
  override readonly priority = BasePriority.Initial + 9;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        "Every morning, straight after the night's victims are announced, the narrator growls like a bear if either of the Bear Tamer's neighbours is a werewolf. Only players still in the game count as neighbours.",
    },
    {
      title: SectionTitles.hintForTheNarrator,
      description:
        'The game is easier to run if eliminated players leave the circle rather than staying in their seats. If the Bear Tamer has been infected by the Primal Wolf, growl every morning until the Bear Tamer is eliminated.',
    },
  ];

  override isAwakeThisNight(round: number) {
    return round <= 0;
  }
}
