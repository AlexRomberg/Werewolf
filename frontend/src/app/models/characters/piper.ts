import { ActionButton, assignCard, filterFalsy, pickButton } from '../actions/action';
import { isAssigned, NightContext } from '../actions/context';
import { BasePriority, Character, GameSets, GroupTypes, SectionTitles } from '../character';

export class Piper extends Character {
  readonly id = 'piper';
  readonly name = 'The Piper';
  readonly group = GroupTypes.Loners;
  readonly game = GameSets.NewMoon;
  override readonly priority = BasePriority.PostWolf + 2;
  readonly description = [
    {
      title: SectionTitles.general,
      description:
        'Each night, when the narrator calls them, the Piper picks two players and the narrator touches those players on the shoulder. The Piper goes back to sleep. The narrator then wakes everyone who is enchanted, new and old, so they can see one another, and sends them back to sleep. As soon as no unenchanted player is left alive, the Piper wins against everyone else, even if the last one was removed by a village vote or by the wolves.',
    },
    {
      title: SectionTitles.attention,
      description:
        "The Piper cannot enchant themselves. The Healer's protection does not stop an enchantment and the Witch cannot cure one. Werewolves are not immune to it. Enchanted players keep all their abilities and traits. Enchantment does not pass between lovers.",
    },
  ];

  override isAwakeThisNight(_context: NightContext) {
    return true;
  }

  override getActions(context: NightContext): (string | false)[] {
    return [!isAssigned(context) && 'Assign person', 'May enchant two players'];
  }

  override getButtons(context: NightContext): ActionButton[] {
    return filterFalsy<ActionButton>([
      !isAssigned(context) && assignCard(context),
      pickButton('enchant', 'Enchant two players', 2, context.roles.enchantedTonight.length > 0),
    ]);
  }
}
