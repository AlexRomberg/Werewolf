import { DOCUMENT, Service, inject, signal } from '@angular/core';
import { KEY_PATTERN, SECRET_KEY_BYTES, type JoinRefusal, type PlayerCard } from '@protocol';
import { CONNECT_TO_ROOM_SERVER, RoomSocket } from './room-socket';
import { StoredValue } from './stored-value';

const HOST_RETRY_MS = 15_000;

interface HeldSeat {
  playerId: string;
  name: string;
}

export type RoomStatus =
  | 'outside'
  | 'joining'
  | 'joined'
  | 'reconnecting'
  | 'host_away'
  | 'kicked'
  | 'moved'
  | 'room_closed'
  | Exclude<JoinRefusal, 'host_away'>;

@Service()
export class RoomPlayerService {
  private readonly connectToRoomServer = inject(CONNECT_TO_ROOM_SERVER);
  private readonly storage = inject(DOCUMENT).defaultView?.localStorage;

  private socket: RoomSocket | null = null;
  private code = '';
  private heldSeat: StoredValue<HeldSeat> | null = null;
  private retryTimer: ReturnType<typeof setTimeout> | undefined;

  private readonly currentStatus = signal<RoomStatus>('outside');
  private readonly dealtCard = signal<PlayerCard | null>(null);
  private readonly ownName = signal('');

  readonly status = this.currentStatus.asReadonly();
  readonly card = this.dealtCard.asReadonly();
  readonly name = this.ownName.asReadonly();

  rejoin(code: string): boolean {
    const seat = this.seatStore(code).read();
    if (seat) {
      this.connect(code, seat);
    }
    return seat !== null;
  }

  join(code: string, name: string) {
    const seat = { playerId: this.seatStore(code).read()?.playerId ?? newSecretKey(), name };
    this.seatStore(code).write(seat);
    this.connect(code, seat);
  }

  rename(name: string) {
    const seat = this.heldSeat?.read();
    const trimmed = name.trim();
    if (!seat || !trimmed) {
      return;
    }

    this.heldSeat?.write({ ...seat, name: trimmed });
    this.ownName.set(trimmed);
    this.socket?.emit('player:rename', trimmed);
  }

  leave() {
    this.socket?.emit('room:leave');
    this.end('outside', { forgetSeat: true });
  }

  private connect(code: string, seat: HeldSeat) {
    this.disconnect();
    this.code = code;
    this.heldSeat = this.seatStore(code);
    this.ownName.set(seat.name);
    this.dealtCard.set(null);

    const socket = this.connectToRoomServer();
    socket.on('connect', () => this.requestSeat(socket));
    socket.on('disconnect', (reason) => {
      if (reason !== 'io client disconnect') {
        this.currentStatus.set('reconnecting');
      }
    });
    socket.on('host:away', () => this.currentStatus.set('host_away'));
    socket.on('host:back', () => this.requestSeat(socket));
    socket.on('player:dealt', (card) => this.dealtCard.set(card));
    socket.on('player:kicked', () => this.end('kicked', { forgetSeat: true }));
    socket.on('player:moved', () => this.end('moved', { forgetSeat: false }));
    socket.on('room:closed', () => this.end('room_closed', { forgetSeat: true }));

    this.socket = socket;
    this.currentStatus.set('joining');
  }

  private async requestSeat(socket: RoomSocket) {
    clearTimeout(this.retryTimer);
    const seat = this.heldSeat?.read();
    if (!seat) {
      return;
    }

    const answer = await socket
      .emitWithAck('room:join', { code: this.code, ...seat })
      .catch(() => null);
    if (!answer || socket !== this.socket) {
      return;
    }

    if (answer.ok) {
      this.currentStatus.set('joined');
    } else if (answer.reason === 'host_away') {
      this.currentStatus.set('host_away');
      this.retryTimer = setTimeout(() => this.requestSeat(socket), HOST_RETRY_MS);
    } else {
      this.end(answer.reason, { forgetSeat: answer.reason === 'room_not_found' });
    }
  }

  private end(status: RoomStatus, { forgetSeat }: { forgetSeat: boolean }) {
    if (forgetSeat) {
      this.heldSeat?.remove();
    }
    this.disconnect();
    this.dealtCard.set(null);
    this.currentStatus.set(status);
  }

  private disconnect() {
    clearTimeout(this.retryTimer);
    this.socket?.disconnect();
    this.socket = null;
  }

  private seatStore(code: string) {
    return new StoredValue<HeldSeat>(this.storage, `werewolf:seat:${code}`, isHeldSeat);
  }
}

function isHeldSeat(value: unknown): value is HeldSeat {
  const { playerId, name } = (value ?? {}) as Partial<Record<keyof HeldSeat, unknown>>;
  return typeof playerId === 'string' && KEY_PATTERN.test(playerId) && typeof name === 'string';
}

function newSecretKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(SECRET_KEY_BYTES));
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}
