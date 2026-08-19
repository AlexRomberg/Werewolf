import { Character, GameSets, GroupTypes, SectionTitles } from '../character';

export class Knight extends Character {
  readonly id = 'knight';
  readonly name = 'The Knight of the Rusty Blade';
  readonly group = GroupTypes.Passive;
  readonly game = GameSets.Characters;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        "If the Knight is devoured they are eliminated, but the rusty blade poisons one of the wolves that took them. Of the guilty wolves, the one sitting nearest to the Knight's left survives the day and dies of the wound the following night. The narrator announces that death the morning after it happens.",
    },
    {
      title: SectionTitles.hint,
      description:
        'Sharp players can work out from this that everyone sitting between the Knight and the poisoned werewolf is an innocent villager.',
    },
  ];
}
