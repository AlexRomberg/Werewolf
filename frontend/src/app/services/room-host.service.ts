import { Service, inject, signal } from '@angular/core';
import type { JoinResult, PlayerCard, RoomPlayer } from '@protocol';
import { CONNECT_TO_ROOM_SERVER, RoomSocket } from './room-socket';

export type SeatResult = { personId: string } | { refused: 'room_full' | 'room_locked' };

/** Where the players who join the room sit; the narrator page decides that, not the room. */
export interface RoomSeating {
  seat(name: string): SeatResult;
  /** The device of the player in this seat disconnected. */
  vacate(personId: string): void;
}

/**
 * The narrator's side of a room: opens it on the room server, seats the players who join it,
 * and deals each of them their card. Which socket sits in which seat is per-device bookkeeping,
 * so it lives here and never in the game state.
 */
@Service()
export class RoomHostService {
  private readonly connectToRoomServer = inject(CONNECT_TO_ROOM_SERVER);

  private socket: RoomSocket | null = null;
  private seating: RoomSeating | null = null;
  private readonly personIdByPlayerId = new Map<string, string>();
  private cards: ReadonlyMap<string, PlayerCard> = new Map();
  /** The last card each player was sent, serialized, so an unchanged card is not sent again. */
  private readonly dealtCardByPlayerId = new Map<string, string>();

  private readonly hosting = signal(false);
  private readonly openCode = signal<string | null>(null);

  readonly isHosting = this.hosting.asReadonly();
  /** The code players join with, or `null` while the room is still being opened. */
  readonly code = this.openCode.asReadonly();

  open(seating: RoomSeating) {
    if (this.socket) {
      return;
    }

    const socket = this.connectToRoomServer();
    // Runs again after every reconnect: the server closed the old room when the host dropped.
    socket.on('connect', async () => {
      const code = await socket.emitWithAck('room:create');
      if (socket.connected) {
        this.openCode.set(code);
      }
    });
    socket.on('disconnect', () => this.forgetRoom());
    socket.on('player:joined', (player, answer) => answer(this.seat(player)));
    socket.on('player:left', (playerId) => this.vacate(playerId));

    this.socket = socket;
    this.seating = seating;
    this.hosting.set(true);
  }

  close() {
    this.socket?.disconnect();
    this.forgetRoom();
    this.socket = null;
    this.seating = null;
    this.hosting.set(false);
  }

  /** Sends every seated player their card, if it changed since they last got it. */
  deal(cardsByPersonId: ReadonlyMap<string, PlayerCard>) {
    this.cards = cardsByPersonId;
    this.personIdByPlayerId.forEach((_, playerId) => this.dealTo(playerId));
  }

  /** Sends away the player sitting in this seat, if a device sits there. */
  kick(personId: string) {
    const playerId = this.playerIn(personId);
    if (playerId) {
      this.socket?.emit('player:kick', playerId);
      this.forgetPlayer(playerId);
    }
  }

  isOccupied(personId: string) {
    return this.playerIn(personId) !== undefined;
  }

  private seat({ id, name }: RoomPlayer): JoinResult {
    const result = this.seating?.seat(name) ?? { refused: 'room_locked' };
    if ('refused' in result) {
      return { ok: false, reason: result.refused };
    }

    this.personIdByPlayerId.set(id, result.personId);
    this.dealTo(id);
    return { ok: true };
  }

  private dealTo(playerId: string) {
    const card = this.cards.get(this.personIdByPlayerId.get(playerId) ?? '');
    const serialized = JSON.stringify(card);
    if (!card || this.dealtCardByPlayerId.get(playerId) === serialized) {
      return;
    }

    this.dealtCardByPlayerId.set(playerId, serialized);
    this.socket?.emit('player:deal', playerId, card);
  }

  /** The players of a closed room are gone, so every seat it filled is vacated. */
  private forgetRoom() {
    this.openCode.set(null);
    [...this.personIdByPlayerId.keys()].forEach((playerId) => this.vacate(playerId));
  }

  private vacate(playerId: string) {
    const personId = this.personIdByPlayerId.get(playerId);
    this.forgetPlayer(playerId);
    if (personId) {
      this.seating?.vacate(personId);
    }
  }

  private forgetPlayer(playerId: string) {
    this.personIdByPlayerId.delete(playerId);
    this.dealtCardByPlayerId.delete(playerId);
  }

  private playerIn(personId: string) {
    return [...this.personIdByPlayerId].find(([, seatedId]) => seatedId === personId)?.[0];
  }
}
