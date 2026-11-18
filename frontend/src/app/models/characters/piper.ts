import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import {
  ActionButton,
  assignButton,
  filterFalsy,
  pickButton,
  COMMON_LINES,
} from '../actions/action';
import { isAssigned, NightContext } from '../actions/context';
import { hasStatus, isAlive, PersonStatus } from '../../services/state/types';
import { BasePriority, Character, GameSet, GroupType } from '../character';

const ENCHANTMENTS_PER_NIGHT = 2;

export class Piper extends Character {
  readonly id = 'piper';
  readonly name = CHARACTER_NAMES.piper;
  readonly group = GroupType.Loners;
  readonly game = GameSet.NewMoon;
  override readonly priority = BasePriority.PostWolf + 2;
  readonly description = CHARACTER_DESCRIPTIONS.piper;

  override isAwakeThisNight(_context: NightContext) {
    return true;
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      $localize`:@@piper.mayEnchantTwoPlayers:May enchant two players`,
      $localize`:@@piper.wakeTheEnchanted:Then wake all enchanted players so they recognise each other`,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      assignButton(context),
      pickButton(
        'enchant',
        $localize`:@@piper.enchantTwoPlayers:Enchant two players`,
        this.picksTonight(context),
        context.roles.enchantedTonight.length > 0,
      ),
    ]);
  }

  private picksTonight(context: NightContext) {
    const isPiper = (id: string) => context.assigned.some((piper) => piper.id === id);
    const candidates = context.people.filter(
      (person) =>
        isAlive(person) &&
        !isPiper(person.id) &&
        (!hasStatus(person, PersonStatus.Enchanted) ||
          context.roles.enchantedTonight.includes(person.id)),
    );
    return Math.max(1, Math.min(ENCHANTMENTS_PER_NIGHT, candidates.length));
  }
}
