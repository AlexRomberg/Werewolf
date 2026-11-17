import { ActionButton, assignButton, filterFalsy, pickButton } from '../actions/action';
import { hasConnection, isAssigned, isFirstNight, NightContext } from '../actions/context';
import { ConnectionType } from '../../services/state/types';
import { BasePriority, Character, GameSet, GroupType, SectionTitles } from '../character';

export class Cupid extends Character {
  readonly id = 'cupid';
  readonly name = 'The Cupid';
  readonly group = GroupType.Active;
  readonly game = GameSet.BaseGame;
  override readonly priority = BasePriority.Initial + 3;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'On the first night Cupid picks the two players who fall in love, in any combination, and may pick themselves as one of the two. If one lover is eliminated, the other dies of grief and is eliminated at once. A lover may never vote against their partner or harm them in any way, not even as a bluff.',
    },
    {
      title: SectionTitles.specialCase,
      description:
        'If one lover is a werewolf and the other a villager, the pair get a goal of their own: to survive together they must see every other player eliminated, villagers and werewolves alike, while still playing by the rules.',
    },
  ];

  override isAwakeThisNight(context: NightContext) {
    return isFirstNight(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && 'Assign person',
      !this.hasCouple(context) && 'Has to pick a couple',
      'The couple has to wake up',
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      assignButton(context),
      pickButton('pair-lovers', 'Assign the couple', 2, this.hasCouple(context)),
    ]);
  }

  private hasCouple(context: NightContext) {
    return hasConnection(context, ConnectionType.Love);
  }
}
