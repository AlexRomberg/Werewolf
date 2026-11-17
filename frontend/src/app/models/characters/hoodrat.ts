import { ActionButton, assignButton, filterFalsy, pickButton } from '../actions/action';
import { hasConnection, isAssigned, NightContext } from '../actions/context';
import { ConnectionType } from '../../services/state/types';
import { BasePriority, Character, GameSet, GroupType, SectionTitles } from '../character';

export class Hoodrat extends Character {
  readonly id = 'hoodrat';
  readonly name = 'The Hoodrat';
  readonly group = GroupType.Active;
  readonly game = GameSet.Special;
  override readonly priority = BasePriority.Initial + 11;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        "When the narrator calls the Hoodrat, before the werewolves, the Hoodrat may choose to spend the night at another player's house. If that player dies during the night, the Hoodrat dies with them. If the werewolves come for the Hoodrat while they are out, the Hoodrat is spared.",
    },
    {
      title: SectionTitles.attention,
      description:
        "The Hoodrat may also stay at home, and may not spend two nights in a row at the same player's house. Where they slept concerns only the wolves: the Witch's poison, the Hunter's shot and the village vote reach the Hoodrat and the host separately. The Healer's protection on the Hoodrat does not cover a host's death.",
    },
  ];

  override isAwakeThisNight(_context: NightContext) {
    return true;
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && 'Assign person',
      !this.hasHost(context) && 'May look for a new home for the night',
      this.hasHost(context) && 'Is finished for this night',
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy([
      assignButton(context),
      isAssigned(context) && pickButton('sleepover', 'Assign a host', 1, this.hasHost(context)),
    ]);
  }

  private hasHost(context: NightContext) {
    return hasConnection(context, ConnectionType.Sleepover);
  }
}
