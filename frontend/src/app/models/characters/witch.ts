import { BasePriority, Character, GameSets, GroupTypes, SectionTitles } from '../character';

export class Witch extends Character {
  readonly id = 'witch';
  readonly name = 'The Witch';
  readonly group = GroupTypes.Active;
  readonly game = GameSets.BaseGame;
  override readonly priority = BasePriority.PostWolf + 1;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'The Witch can brew two very powerful potions: a healing potion that saves a player the werewolves have chosen as their victim, and a poison that kills any player of their choice during the night. Each potion may be used once per game, and both may be used on the same night. The Witch may also use the healing potion on themselves.',
    },
  ];

  override isAwakeThisNight(_round: number) {
    // TODO (ARO): sleeps once both potions are spent
    return true;
  }
}
