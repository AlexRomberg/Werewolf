import { ActionButton, assignButton, filterFalsy, pickButton } from '../actions/action';
import { hasMarkedVictim, isAbilityUsed, isAssigned, NightContext } from '../actions/context';
import { BasePriority, Character, GameSet, GroupType, SectionTitles } from '../character';

export class Witch extends Character {
  readonly id = 'witch';
  readonly name = 'The Witch';
  readonly group = GroupType.Active;
  readonly game = GameSet.BaseGame;
  override readonly priority = BasePriority.PostWolf + 1;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'The Witch can brew two very powerful potions: a healing potion that saves a player the werewolves have chosen as their victim, and a poison that kills any player of their choice during the night. Each potion may be used once per game, and both may be used on the same night. The Witch may also use the healing potion on themselves.',
    },
  ];

  override isAwakeThisNight(context: NightContext) {
    return this.hasHealingPotion(context) || this.hasPoison(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && 'Assign person',
      !this.hasHealingPotion(context) && !this.hasPoison(context) && 'Has no potion left',
      this.hasHealingPotion(context) && 'May use the healing potion',
      this.hasPoison(context) && 'May use the poison',
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    const healed = context.roles.healedTonight !== undefined;
    const poisoned = hasMarkedVictim(context, this.id);

    // The potions never ask by themselves, and one used tonight can still be taken back.
    return filterFalsy<ActionButton>([
      assignButton(context),
      (this.hasHealingPotion(context) || healed) && pickButton('heal', 'Heal', 1, healed, false),
      (this.hasPoison(context) || poisoned) &&
        pickButton('poison', 'Poison someone', 1, poisoned, false),
    ]);
  }

  private hasHealingPotion(context: NightContext) {
    return !isAbilityUsed(context, 'witch_heal');
  }

  private hasPoison(context: NightContext) {
    return !isAbilityUsed(context, 'witch_poison');
  }
}
