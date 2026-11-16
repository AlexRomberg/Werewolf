/**
 * The socket.io events between the narrator's device (the host), the players who join its room,
 * and the server that relays between them. The frontend imports this file too, so both ends
 * agree on every event name and payload.
 */

export const ROOM_CODE_LENGTH = 2;
export const ROOM_CODE_PATTERN = new RegExp(`^\\d{${ROOM_CODE_LENGTH}}$`);
export const MAX_NAME_LENGTH = 30;

/** A device that joined a room, identified by its socket id. */
export interface RoomPlayer {
  id: string;
  name: string;
}

export interface JoinRequest {
  code: string;
  name: string;
}

export type JoinRefusal =
  | 'room_not_found'
  | 'name_missing'
  /** Every seat at the table is taken. */
  | 'room_full'
  /** The game has started and there is no seat of that name waiting for its player. */
  | 'room_locked'
  | 'host_unreachable';

export type JoinResult = { ok: true } | { ok: false; reason: JoinRefusal };

export type LinkType = 'love' | 'trust' | 'sleepover';

/** Someone a player is linked to, as far as that player is allowed to know. */
export interface PlayerLink {
  type: LinkType;
  name: string;
}

/** What a player's own device shows them: their card, and only what they know about themselves. */
export interface PlayerCard {
  characterId: string | null;
  isDead: boolean;
  isWerewolf: boolean;
  isEnchanted: boolean;
  links: PlayerLink[];
}

export interface ClientToServerEvents {
  /** Opens a room hosted by the sender and answers with its code, or `null` when no code is free. */
  'room:create': (answer: (code: string | null) => void) => void;
  'room:join': (request: JoinRequest, answer: (result: JoinResult) => void) => void;
  /** Host only. */
  'player:kick': (playerId: string) => void;
  /** Host only. */
  'player:deal': (playerId: string, card: PlayerCard) => void;
}

export interface ServerToClientEvents {
  /** Sent to the host, which decides whether there is a seat for the player. */
  'player:joined': (player: RoomPlayer, answer: (result: JoinResult) => void) => void;
  /** Sent to the host, with the id of the player who disconnected. */
  'player:left': (playerId: string) => void;
  /** Sent to a player whose card changed. */
  'player:dealt': (card: PlayerCard) => void;
  /** Sent to a player the host removed from the table. */
  'player:kicked': () => void;
  /** Sent to the players when the host disconnects. */
  'room:closed': () => void;
}
