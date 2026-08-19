import { BasePriority, Character, GameSets, GroupTypes, SectionTitles } from '../character';

export class Cupid extends Character {
  readonly id = 'cupid';
  readonly name = 'The Cupid';
  readonly group = GroupTypes.Active;
  readonly game = GameSets.BaseGame;
  override readonly priority = BasePriority.Initial + 3;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'On the first night Cupid picks the two players who fall in love, in any combination, and may pick themselves as one of the two. If one lover is eliminated, the other dies of grief and is eliminated at once. A lover may never vote against their partner or harm them in any way, not even as a bluff.',
    },
    {
      title: SectionTitles.specialCase,
      description:
        'If one lover is a werewolf and the other a villager, the pair get a goal of their own: to survive together they must see every other player eliminated, villagers and werewolves alike, while still playing by the rules.',
    },
  ];

  override isAwakeThisNight(round: number) {
    return round === 0;
  }
}
