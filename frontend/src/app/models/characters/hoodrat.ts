import { CHARACTER_DESCRIPTIONS } from '../../i18n/descriptions';
import { CHARACTER_NAMES } from '../../i18n/names';
import {
  ActionButton,
  assignButton,
  filterFalsy,
  pickButton,
  COMMON_LINES,
} from '../actions/action';
import { hasConnection, isAssigned, NightContext } from '../actions/context';
import { ConnectionType } from '../../services/state/types';
import { BasePriority, Character, GameSet, GroupType } from '../character';

export class Hoodrat extends Character {
  readonly id = 'hoodrat';
  readonly name = CHARACTER_NAMES.hoodrat;
  readonly group = GroupType.Active;
  readonly game = GameSet.Special;
  override readonly priority = BasePriority.Initial + 12;
  readonly description = CHARACTER_DESCRIPTIONS.hoodrat;

  override isAwakeThisNight(_context: NightContext) {
    return true;
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && COMMON_LINES.assignPerson,
      !this.hasHost(context) &&
        $localize`:@@hoodrat.mayLookForANew:May look for a new home for the night`,
      this.hasHost(context) && COMMON_LINES.finishedForTheNight,
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy([
      assignButton(context),
      isAssigned(context) &&
        pickButton(
          'sleepover',
          $localize`:@@hoodrat.assignAHost:Assign a host`,
          1,
          this.hasHost(context),
        ),
    ]);
  }

  private hasHost(context: NightContext) {
    return hasConnection(context, ConnectionType.Sleepover);
  }
}
