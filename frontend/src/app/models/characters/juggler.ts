import { BasePriority, Character, GameSets, GroupTypes, SectionTitles } from '../character';

export class Juggler extends Character {
  readonly id = 'juggler';
  readonly name = 'The Juggler';
  readonly group = GroupTypes.Passive;
  readonly game = GameSets.Characters;
  override readonly priority = BasePriority.Initial + 2;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'Before the game the narrator picks three characters with special abilities and lays them face up in the middle of the table once the roles have been dealt. Each night, when called, the Juggler chooses one of those cards and plays as that character until the next night. The chosen card is then taken out of the display and out of the game.',
    },
    { title: SectionTitles.attention, description: 'No wolf may be put in the display.' },
    {
      title: SectionTitles.hintForTheNarrator,
      description:
        "The cards you offer the Juggler are a lever on the whole game. Use them to stir up trouble, or to give the village a chance against a strong pack. If the Thief is also in play, lay out the Thief's two cards first and the Juggler's three afterwards.",
    },
  ];

  override isAwakeThisNight(_round: number) {
    return true;
  }
}
