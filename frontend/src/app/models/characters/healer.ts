import { ActionButton, assignCard, filterFalsy, pickButton } from '../actions/action';
import { isAssigned, NightContext, someoneHas } from '../actions/context';
import { PlayerStatus } from '../../services/state/types';
import { BasePriority, Character, GameSets, GroupTypes, SectionTitles } from '../character';

export class Healer extends Character {
  readonly id = 'healer';
  readonly name = 'The Healer';
  readonly group = GroupTypes.Active;
  readonly game = GameSets.NewMoon;
  override readonly priority = BasePriority.Initial + 10;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'When the narrator calls the Healer, before the werewolves, the Healer points at one player. That player is protected from the werewolves for that night only. If the wolves choose them as their victim, they are not eliminated.',
    },
    {
      title: SectionTitles.attention,
      description:
        'The Healer may protect themselves, but may not protect the same player on two nights in a row. The protection does nothing for the Little Girl, who is deep in a teenage crisis and will go looking for trouble whatever anyone does. It is also no defence against the Piper or against infection by the Primal Wolf.',
    },
  ];

  override isAwakeThisNight(_context: NightContext) {
    return true;
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && 'Assign person',
      !this.hasProtected(context) && 'May make one player immortal for this night',
      this.hasProtected(context) && 'Is finished for this night',
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      !isAssigned(context) && assignCard(context),
      pickButton('protect', 'Protect a player', 1, this.hasProtected(context)),
    ]);
  }

  private hasProtected(context: NightContext) {
    return someoneHas(context, PlayerStatus.Protected);
  }
}
