import { GameSet, GroupType } from '../models/character';

export const CHARACTER_NAMES = {
  angel: $localize`:@@character.angel.name:The Angel`,
  bear_tamer: $localize`:@@character.bear_tamer.name:The Bear Tamer`,
  big_wolf: $localize`:@@character.big_wolf.name:The Big Bad Wolf`,
  bitter_old_man: $localize`:@@character.bitter_old_man.name:The Bitter Old Man`,
  brothers: $localize`:@@character.brothers.name:The Three Brothers`,
  cupid: $localize`:@@character.cupid.name:The Cupid`,
  elder: $localize`:@@character.elder.name:The Elder`,
  fox: $localize`:@@character.fox.name:The Fox`,
  healer: $localize`:@@character.healer.name:The Healer`,
  hoodrat: $localize`:@@character.hoodrat.name:The Hoodrat`,
  hunter: $localize`:@@character.hunter.name:The Hunter`,
  judge: $localize`:@@character.judge.name:The Stuttering Judge`,
  juggler: $localize`:@@character.juggler.name:The Juggler`,
  knight: $localize`:@@character.knight.name:The Knight of the Rusty Blade`,
  maid: $localize`:@@character.maid.name:The Devoted Maid`,
  piper: $localize`:@@character.piper.name:The Piper`,
  primal_wolf: $localize`:@@character.primal_wolf.name:The Primal Wolf`,
  scapegoat: $localize`:@@character.scapegoat.name:The Scapegoat`,
  seer: $localize`:@@character.seer.name:The Seer`,
  sisters: $localize`:@@character.sisters.name:The Two Sisters`,
  small_child: $localize`:@@character.small_child.name:The Little Girl`,
  thief: $localize`:@@character.thief.name:The Thief`,
  village_idiot: $localize`:@@character.village_idiot.name:The Village Idiot`,
  villager: $localize`:@@character.villager.name:The Simple Villager`,
  werewolf: $localize`:@@character.werewolf.name:The Simple Werewolf`,
  white_wolf: $localize`:@@character.white_wolf.name:The White Wolf`,
  wild_child: $localize`:@@character.wild_child.name:The Wild Child`,
  witch: $localize`:@@character.witch.name:The Witch`,
  wolfdog: $localize`:@@character.wolfdog.name:The Wolfdog`,
} as const;

export type CharacterId = keyof typeof CHARACTER_NAMES;

/** How to call a single holder of a card that several players share. */
export const MEMBER_NAMES = {
  brothers: $localize`:@@character.brothers.memberName:One of the Three Brothers`,
  sisters: $localize`:@@character.sisters.memberName:One of the Two Sisters`,
} as const;

export const GROUP_LABELS: ReadonlyMap<GroupType, string> = new Map([
  [GroupType.Wolves, $localize`:@@group.wolves:Wolves`],
  [GroupType.Active, $localize`:@@group.active:Active`],
  [GroupType.Passive, $localize`:@@group.passive:Passive`],
  [GroupType.Loners, $localize`:@@group.loners:Loners`],
]);

export const GAME_SET_LABELS: ReadonlyMap<GameSet, string> = new Map([
  [GameSet.BaseGame, $localize`:@@gameSet.baseGame:Base Game`],
  [GameSet.Characters, $localize`:@@gameSet.characters:Characters`],
  [GameSet.NewMoon, $localize`:@@gameSet.newMoon:New Moon`],
  [GameSet.Special, $localize`:@@gameSet.special:Special`],
]);
