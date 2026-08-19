import { BasePriority, Character, GameSets, GroupTypes, SectionTitles } from '../character';

export class Thief extends Character {
  readonly id = 'thief';
  readonly name = 'The Thief';
  readonly group = GroupTypes.Active;
  readonly game = GameSets.BaseGame;
  override readonly priority = BasePriority.Initial + 1;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'To play with the Thief, add two extra Simple Villager cards to the deck before the game begins. Once the roles are dealt, the two cards left over go face down in the middle of the table. On the first night the Thief looks at both and may swap their own card for one of them. If both are werewolves, the Thief must take one of them. Whatever they end up with is theirs for the rest of the game.',
    },
  ];

  override isAwakeThisNight(round: number) {
    return round === 0;
  }
}
