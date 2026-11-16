import { ActionButton, assignButton, filterFalsy } from '../actions/action';
import { isAbilityUsed, isAssigned, NightContext } from '../actions/context';
import { BasePriority, Character, GameSet, GroupType, SectionTitles } from '../character';

export class Fox extends Character {
  readonly id = 'fox';
  readonly name = 'The Fox';
  readonly group = GroupType.Active;
  readonly game = GameSet.Characters;
  override readonly priority = BasePriority.Initial + 5;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'When the narrator calls the Fox at night, the Fox may point at one player to choose that player and both of their neighbours. If at least one werewolf is among those three, the narrator confirms it and the Fox keeps the ability for the following night. If none of the three is a werewolf, the Fox loses the ability for good, but now knows three players who are above suspicion.',
    },
    {
      title: SectionTitles.hint,
      description:
        'The narrator calls the Fox every night, but the Fox does not have to use the ability every night.',
    },
    {
      title: SectionTitles.hintForTheNarrator,
      description:
        'Never show the Fox the cards of the three players. They learn only whether at least one werewolf is among them.',
    },
  ];

  override isAwakeThisNight(context: NightContext) {
    return !this.hasMissed(context);
  }

  override getActions(context: NightContext): (string | false)[] {
    return [
      !isAssigned(context) && 'Assign person',
      !this.hasMissed(context) &&
        'May point at a player; confirm if they or one of their neighbours is a werewolf',
      this.hasMissed(context) && 'Has missed and will not wake up again from tomorrow night',
      'Never show the three cards',
    ];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      assignButton(context),
      { kind: 'lose-fox-request', label: 'Has missed', done: this.hasMissed(context) },
    ]);
  }

  private hasMissed(context: NightContext) {
    return isAbilityUsed(context, 'fox_request');
  }
}
