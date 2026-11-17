import { Character, GameSet, GroupType, SectionTitles } from '../character';

export class Villager extends Character {
  readonly id = 'villager';
  readonly name = 'The Simple Villager';
  readonly group = GroupType.Passive;
  readonly game = GameSet.BaseGame;
  override readonly hasMultiple = true;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'The Simple Villager has no special ability. Their only weapons are a sharp eye for suspicious behaviour and the knack of talking the rest of the village round to their innocence.',
    },
  ];
}
