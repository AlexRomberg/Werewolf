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

export const VILLAGER = new Villager();
export const WEREWOLF = new Werewolf();

export const BULK_CHARACTERS: readonly Character[] = [WEREWOLF, VILLAGER];

export const CHARACTERS: readonly Character[] = [
  new Angel(),
  new BearTamer(),
  new BigWolf(),
  new BitterOldMan(),
  new Brothers(),
  new Cupid(),
  new Elder(),
  new Fox(),
  new Healer(),
  new Hoodrat(),
  new Hunter(),
  new Judge(),
  new Juggler(),
  new Knight(),
  new Maid(),
  new Piper(),
  new PrimalWolf(),
  new Scapegoat(),
  new Seer(),
  new Sisters(),
  new SmallChild(),
  new Thief(),
  new VillageIdiot(),
  VILLAGER,
  WEREWOLF,
  new WhiteWolf(),
  new WildChild(),
  new Witch(),
  new Wolfdog(),
];

export const CHARACTERS_BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]));
