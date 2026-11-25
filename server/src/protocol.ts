export const ROOM_CODE_LENGTH = 6;
export const ROOM_CODE_PATTERN = new RegExp(`^\\d{${ROOM_CODE_LENGTH}}$`);
export const MAX_NAME_LENGTH = 30;
export const MAX_PLAYERS = 20;
export const KEY_PATTERN = /^[A-Za-z0-9_-]{22,64}$/;
export const SECRET_KEY_BYTES = 24;

export interface HostSession {
  code: string;
  hostKey: string;
}

export interface RoomPlayer {
  id: string;
  name: string;
}

export interface JoinRequest {
  code: string;
  playerId: string;
  name: string;
}

export type JoinRefusal =
  | 'room_not_found'
  | 'invalid_request'
  | 'room_full'
  | 'room_locked'
  | 'host_away'
  | 'too_many_attempts';

export type JoinResult = { ok: true } | { ok: false; reason: JoinRefusal };

export type ResumeResult =
  { ok: true; playerIds: string[]; disconnectedPlayerIds: string[] } | { ok: false };

export type LinkType = 'love' | 'trust' | 'sleepover';

export interface PlayerLink {
  type: LinkType;
  name: string;
}

export interface PlayerCard {
  name: string;
  characterId: string | null;
  isDead: boolean;
  isWerewolf: boolean;
  isEnchanted: boolean;
  links: PlayerLink[];
  middleCards: string[];
}

export interface ClientToServerEvents {
  'room:create': (answer: (session: HostSession | null) => void) => void;
  'room:resume': (session: HostSession, answer: (result: ResumeResult) => void) => void;
  'room:close': () => void;
  'room:join': (request: JoinRequest, answer: (result: JoinResult) => void) => void;
  'room:leave': () => void;
  'player:rename': (name: string) => void;
  'player:kick': (playerId: string) => void;
  'player:deal': (playerId: string, card: PlayerCard) => void;
}

export interface ServerToClientEvents {
  'player:joined': (player: RoomPlayer, answer: (result: JoinResult) => void) => void;
  'player:left': (playerId: string) => void;
  'player:disconnected': (playerId: string) => void;
  'player:renamed': (playerId: string, name: string) => void;
  'player:dealt': (card: PlayerCard) => void;
  'player:kicked': () => void;
  'player:moved': () => void;
  'host:away': () => void;
  'host:back': () => void;
  'room:closed': () => void;
}
