import { ActionButton, assignCard } from '../actions/action';
import { isAssigned, NightContext } from '../actions/context';
import { BasePriority, Character, GameSets, GroupTypes, SectionTitles } from '../character';

export class Scapegoat extends Character {
  readonly id = 'scapegoat';
  readonly name = 'The Scapegoat';
  readonly group = GroupTypes.Passive;
  readonly game = GameSets.NewMoon;
  override readonly priority = BasePriority.Initial + 12;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'If the village vote ends in a tie, the Scapegoat is eliminated instead of either of the tied players, so it is on them to steer the day away from that ending. A Scapegoat who is eliminated keeps one privilege: they decide who may vote the next day and who may not.',
    },
    {
      title: SectionTitles.attention,
      description:
        'Naming a single voter risks the werewolves devouring that player the following night, which would leave the village with no vote at all. Unless, of course, the chosen player is a werewolf, or the wolves leave them alive on purpose.',
    },
  ];

  override isAwakeThisNight(context: NightContext) {
    return context.round <= 0;
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && 'Assign person',
      'Can go back to sleep right away',
      'Is chosen whenever a vote ends in a tie',
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return isAssigned(context) ? [] : [assignCard(context)];
  }
}
