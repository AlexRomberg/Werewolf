import { DOCUMENT, Service, computed, inject, signal } from '@angular/core';
import type { HostSession, JoinResult, PlayerCard, RoomPlayer } from '@protocol';
import { CONNECT_TO_ROOM_SERVER, RoomSocket } from './room-socket';
import { StoredValue } from './room-storage';

export type SeatResult = { personId: string } | { refused: 'room_full' | 'room_locked' };

export interface RoomSeating {
  seat(name: string): SeatResult;
  hasSeat(personId: string): boolean;
  rename(personId: string, name: string): void;
  vacate(personId: string): void;
}

@Service()
export class RoomHostService {
  private readonly connectToRoomServer = inject(CONNECT_TO_ROOM_SERVER);
  private readonly storedSession = new StoredValue<HostSession>(
    inject(DOCUMENT).defaultView?.sessionStorage,
    'werewolf:host-session',
    isHostSession,
  );

  private socket: RoomSocket | null = null;
  private seating: RoomSeating | null = null;
  private readonly personIdByPlayerId = new Map<string, string>();
  private cards: ReadonlyMap<string, PlayerCard> = new Map();
  private readonly dealtCardByPlayerId = new Map<string, string>();

  private readonly hosting = signal(false);
  private readonly connected = signal(false);
  private readonly session = signal<HostSession | null>(this.storedSession.read());

  readonly isHosting = this.hosting.asReadonly();
  readonly isConnected = this.connected.asReadonly();
  readonly code = computed(() => this.session()?.code ?? null);

  hasRoomToResume() {
    return this.session() !== null;
  }

  open(seating: RoomSeating) {
    if (this.socket) {
      return;
    }

    const socket = this.connectToRoomServer();
    socket.on('connect', () => this.claimRoom(socket));
    socket.on('disconnect', () => this.connected.set(false));
    socket.on('player:joined', (player, answer) => answer(this.seat(player)));
    socket.on('player:left', (playerId) => this.vacate(playerId));
    socket.on('player:renamed', (playerId, name) => {
      const personId = this.personIdByPlayerId.get(playerId);
      if (personId) {
        this.seating?.rename(personId, name);
      }
    });

    this.socket = socket;
    this.seating = seating;
    this.hosting.set(true);
  }

  close() {
    this.socket?.emit('room:close');
    this.socket?.disconnect();
    this.socket = null;
    this.setSession(null);
    this.vacateAll();
    this.seating = null;
    this.hosting.set(false);
    this.connected.set(false);
  }

  deal(cardsByPersonId: ReadonlyMap<string, PlayerCard>) {
    this.cards = cardsByPersonId;
    this.personIdByPlayerId.forEach((_, playerId) => this.dealTo(playerId));
  }

  kick(personId: string) {
    const playerId = this.playerIn(personId);
    if (playerId) {
      this.socket?.emit('player:kick', playerId);
      this.forgetPlayer(playerId);
    }
  }

  private async claimRoom(socket: RoomSocket) {
    try {
      const session = this.session();
      if (session) {
        const resumed = await socket.emitWithAck('room:resume', session);
        if (resumed.ok) {
          this.letGoOfPlayersOtherThan(resumed.playerIds);
          this.connected.set(true);
          return;
        }
        this.vacateAll();
      }

      const created = await socket.emitWithAck('room:create');
      this.setSession(created);
      this.connected.set(created !== null);
    } catch {}
  }

  private seat({ id, name }: RoomPlayer): JoinResult {
    const seating = this.seating;
    if (!seating) {
      return { ok: false, reason: 'room_locked' };
    }

    const knownSeat = this.personIdByPlayerId.get(id);
    if (knownSeat && seating.hasSeat(knownSeat)) {
      this.dealtCardByPlayerId.delete(id);
      this.dealTo(id);
      return { ok: true };
    }

    const result = seating.seat(name);
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

  private letGoOfPlayersOtherThan(playerIds: readonly string[]) {
    [...this.personIdByPlayerId.keys()]
      .filter((playerId) => !playerIds.includes(playerId))
      .forEach((playerId) => this.vacate(playerId));
  }

  private vacateAll() {
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

  private setSession(session: HostSession | null) {
    this.session.set(session);
    if (session) {
      this.storedSession.write(session);
    } else {
      this.storedSession.remove();
    }
  }
}

function isHostSession(value: unknown): value is HostSession {
  const { code, hostKey } = (value ?? {}) as Partial<Record<keyof HostSession, unknown>>;
  return typeof code === 'string' && typeof hostKey === 'string';
}
