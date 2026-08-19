import { BasePriority, Character, GameSets, GroupTypes, SectionTitles } from '../character';

export class Hoodrat extends Character {
  readonly id = 'hoodrat';
  readonly name = 'The Hoodrat';
  readonly group = GroupTypes.Active;
  readonly game = GameSets.Special;
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

  override isAwakeThisNight(_round: number) {
    return true;
  }
}
