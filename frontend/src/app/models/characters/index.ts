import { Angel } from './angel';
import { BearTamer } from './bear-tamer';
import { BigWolf } from './big-wolf';
import { BitterOldMan } from './bitter-old-man';
import { Brothers } from './brothers';
import { Character } from '../character';
import { Cupid } from './cupid';
import { Elder } from './elder';
import { Fox } from './fox';
import { Healer } from './healer';
import { Hoodrat } from './hoodrat';
import { Hunter } from './hunter';
import { Judge } from './judge';
import { Juggler } from './juggler';
import { Knight } from './knight';
import { Maid } from './maid';
import { Piper } from './piper';
import { PrimalWolf } from './primal-wolf';
import { Scapegoat } from './scapegoat';
import { Seer } from './seer';
import { Sisters } from './sisters';
import { SmallChild } from './small-child';
import { Thief } from './thief';
import { VillageIdiot } from './village-idiot';
import { Villager } from './villager';
import { Werewolf } from './werewolf';
import { WhiteWolf } from './white-wolf';
import { WildChild } from './wild-child';
import { Witch } from './witch';
import { Wolfdog } from './wolfdog';

export const ANGEL = new Angel();
export const BEAR_TAMER = new BearTamer();
export const BITTER_OLD_MAN = new BitterOldMan();
export const ELDER = new Elder();
export const HEALER = new Healer();
export const HOODRAT = new Hoodrat();
export const JUGGLER = new Juggler();
export const KNIGHT = new Knight();
export const SMALL_CHILD = new SmallChild();
export const THIEF = new Thief();
export const VILLAGER = new Villager();
export const WEREWOLF = new Werewolf();
export const WHITE_WOLF = new WhiteWolf();
export const WITCH = new Witch();

export const BULK_CHARACTERS: readonly Character[] = [WEREWOLF, VILLAGER];

export const CHARACTERS: readonly Character[] = [
  ANGEL,
  BEAR_TAMER,
  new BigWolf(),
  BITTER_OLD_MAN,
  new Brothers(),
  new Cupid(),
  ELDER,
  new Fox(),
  HEALER,
  HOODRAT,
  new Hunter(),
  new Judge(),
  JUGGLER,
  KNIGHT,
  new Maid(),
  new Piper(),
  new PrimalWolf(),
  new Scapegoat(),
  new Seer(),
  new Sisters(),
  SMALL_CHILD,
  THIEF,
  new VillageIdiot(),
  VILLAGER,
  WEREWOLF,
  WHITE_WOLF,
  new WildChild(),
  WITCH,
  new Wolfdog(),
];

export const CHARACTERS_BY_ID = new Map(CHARACTERS.map((character) => [character.id, character]));
