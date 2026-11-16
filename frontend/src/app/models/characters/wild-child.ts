import { ActionButton, assignButton, filterFalsy, pickButton } from '../actions/action';
import { hasConnection, isAssigned, isFirstNight, NightContext } from '../actions/context';
import { ConnectionType } from '../../services/state/types';
import { BasePriority, Character, GameSet, GroupType, SectionTitles } from '../character';

export class WildChild extends Character {
  readonly id = 'wild_child';
  readonly name = 'The Wild Child';
  readonly group = GroupType.Wolves;
  readonly game = GameSet.Characters;
  override readonly priority = BasePriority.Initial + 8;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'The Wild Child starts as a villager. On the first night the narrator calls them and they silently choose a role model. If that role model is killed at any point, the Wild Child turns their back on the village and goes back to the wolves, waking with the pack every night from then on. While the role model lives the Wild Child stays a villager, even if the role model turns out to be a werewolf. The Wild Child may help eliminate their own role model if they want to. If the role model is still alive when the last wolf is eliminated, the Wild Child wins with the village. If the role model is gone and the wolves win, the Wild Child shares that victory instead.',
    },
    {
      title: SectionTitles.hintForTheNarrator,
      description:
        "It adds to the tension to keep the Wild Child's true identity secret if the village votes them out, so nobody knows whether a villager or a werewolf was eliminated.",
    },
  ];

  override isAwakeThisNight(context: NightContext) {
    return isFirstNight(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && 'Assign person',
      !this.hasRoleModel(context) && 'Has to choose a role model',
      'Turns into a werewolf if the role model dies',
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy([
      assignButton(context),
      isAssigned(context) &&
        pickButton('set-role-model', 'Assign the role model', 1, this.hasRoleModel(context)),
    ]);
  }

  private hasRoleModel(context: NightContext) {
    return hasConnection(context, ConnectionType.Trust);
  }
}
