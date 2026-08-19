import { BasePriority, Character, GameSets, GroupTypes, SectionTitles } from '../character';

export class Fox extends Character {
  readonly id = 'fox';
  readonly name = 'The Fox';
  readonly group = GroupTypes.Active;
  readonly game = GameSets.Characters;
  override readonly priority = BasePriority.Initial + 5;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'When the narrator calls the Fox at night, the Fox may point at one player to choose that player and both of their neighbours. If at least one werewolf is among those three, the narrator confirms it and the Fox keeps the ability for the following night. If none of the three is a werewolf, the Fox loses the ability for good, but now knows three players who are above suspicion.',
    },
    {
      title: SectionTitles.hint,
      description:
        'The narrator calls the Fox every night, but the Fox does not have to use the ability every night.',
    },
    {
      title: SectionTitles.hintForTheNarrator,
      description:
        'Never show the Fox the cards of the three players. They learn only whether at least one werewolf is among them.',
    },
  ];

  override isAwakeThisNight(_round: number) {
    // TODO (ARO): sleeps once it has missed
    return true;
  }
}
