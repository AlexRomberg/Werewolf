import { BasePriority, Character, GameSets, GroupTypes, SectionTitles } from '../character';

export class WildChild extends Character {
  readonly id = 'wild_child';
  readonly name = 'The Wild Child';
  readonly group = GroupTypes.Wolves;
  readonly game = GameSets.Characters;
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

  override isAwakeThisNight(round: number) {
    return round === 0;
  }
}
