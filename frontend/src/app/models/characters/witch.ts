import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import {
  ActionButton,
  assignButton,
  filterFalsy,
  pickButton,
  COMMON_LINES,
} from '../actions/action';
import { hasMarkedVictim, isAbilityUsed, isAssigned, NightContext } from '../actions/context';
import { BasePriority, Character, GameSet, GroupType } from '../character';

export class Witch extends Character {
  readonly id = 'witch';
  readonly name = CHARACTER_NAMES.witch;
  readonly group = GroupType.Active;
  readonly game = GameSet.BaseGame;
  override readonly priority = BasePriority.PostWolf + 1;
  readonly description = CHARACTER_DESCRIPTIONS.witch;

  override isAwakeThisNight(context: NightContext) {
    return this.hasHealingPotion(context) || this.hasPoison(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      !this.hasHealingPotion(context) &&
        !this.hasPoison(context) &&
        $localize`:@@witch.hasNoPotionLeft:Has no potion left`,
      this.hasHealingPotion(context) &&
        $localize`:@@witch.mayUseTheHealingPotion:May use the healing potion`,
      this.hasPoison(context) && $localize`:@@witch.mayUseThePoison:May use the poison`,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    const healed = context.roles.healedTonight !== undefined;
    const poisoned = hasMarkedVictim(context, this.id);

    return filterFalsy<ActionButton>([
      assignButton(context),
      (this.hasHealingPotion(context) || healed) &&
        pickButton('heal', $localize`:@@witch.heal:Heal`, 1, healed, false),
      (this.hasPoison(context) || poisoned) &&
        pickButton('poison', $localize`:@@witch.poisonSomeone:Poison someone`, 1, poisoned, false),
    ]);
  }

  private hasHealingPotion(context: NightContext) {
    return !isAbilityUsed(context, 'witch_heal');
  }

  private hasPoison(context: NightContext) {
    return !isAbilityUsed(context, 'witch_poison');
  }
}
