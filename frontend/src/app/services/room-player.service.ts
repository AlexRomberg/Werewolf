import { Service, inject, signal } from '@angular/core';
import type { JoinRefusal, JoinRequest, PlayerCard } from '@protocol';
import { CONNECT_TO_ROOM_SERVER, RoomSocket } from './room-socket';

export type RoomStatus = 'outside' | 'joining' | 'joined' | 'kicked' | 'room_closed' | JoinRefusal;

/** A player's side of a room: joins the narrator's room under a name, and holds the card dealt to it. */
@Service()
export class RoomPlayerService {
  private readonly connectToRoomServer = inject(CONNECT_TO_ROOM_SERVER);

  private socket: RoomSocket | null = null;
  private readonly currentStatus = signal<RoomStatus>('outside');
  private readonly dealtCard = signal<PlayerCard | null>(null);

  readonly status = this.currentStatus.asReadonly();
  /** `null` until the host dealt one. */
  readonly card = this.dealtCard.asReadonly();

  join(request: JoinRequest) {
    this.disconnect();
    this.dealtCard.set(null);

    const socket = this.connectToRoomServer();
    // Runs again after every reconnect: the server told the host the player had left.
    socket.on('connect', async () => {
      const result = await socket.emitWithAck('room:join', request);
      this.currentStatus.set(result.ok ? 'joined' : result.reason);
      if (!result.ok) {
        this.disconnect();
      }
    });
    socket.on('disconnect', (reason) => {
      if (reason !== 'io client disconnect') {
        this.currentStatus.set('joining');
      }
    });
    socket.on('player:dealt', (card) => this.dealtCard.set(card));
    socket.on('player:kicked', () => this.endWith('kicked'));
    socket.on('room:closed', () => this.endWith('room_closed'));

    this.socket = socket;
    this.currentStatus.set('joining');
  }

  leave() {
    this.endWith('outside');
  }

  private endWith(status: RoomStatus) {
    this.disconnect();
    this.dealtCard.set(null);
    this.currentStatus.set(status);
  }

  private disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}
