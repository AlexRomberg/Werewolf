import { Character, GameSet, GroupType, SectionTitles } from '../character';

export class SmallChild extends Character {
  readonly id = 'small_child';
  readonly name = 'The Little Girl';
  readonly group = GroupType.Active;
  readonly game = GameSet.BaseGame;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'The Little Girl may spy on the werewolves through half-closed eyes during the wolf phase. If the wolves notice, they may devour the Little Girl on the spot, silently, in place of the victim they had chosen. The Little Girl may only spy while the werewolves are awake, and must never open their eyes wide to pass as one of the pack.',
    },
  ];
}
