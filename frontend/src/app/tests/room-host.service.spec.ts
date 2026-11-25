import { TestBed } from '@angular/core/testing';
import type { HostSession, JoinResult, PlayerCard } from '@protocol';
import { RoomHostService, RoomSeating, SeatResult } from '../services/room-host.service';
import { CONNECT_TO_ROOM_SERVER } from '../services/room-socket';
import { FakeRoomSocket, settle } from './fake-room-socket';

const SESSION: HostSession = { code: '123456', hostKey: 'host-key' };
const SESSION_KEY = 'werewolf:host-session';

function card(overrides: Partial<PlayerCard> = {}): PlayerCard {
  return {
    name: 'Anna',
    characterId: null,
    isDead: false,
    isWerewolf: false,
    isEnchanted: false,
    links: [],
    middleCards: [],
    ...overrides,
  };
}

describe('RoomHostService', () => {
  let sockets: FakeRoomSocket[];
  let socket: FakeRoomSocket;
  let host: RoomHostService;
  let seatResult: SeatResult;
  let seats: Set<string>;
  let vacated: string[];
  let renamed: [string, string][];
  const seating: RoomSeating = {
    seat: () => {
      if ('personId' in seatResult) {
        seats.add(seatResult.personId);
      }
      return seatResult;
    },
    hasSeat: (personId) => seats.has(personId),
    rename: (personId, name) => renamed.push([personId, name]),
    vacate: (personId) => vacated.push(personId),
  };

  const join = (id: string, name = 'Anna') =>
    socket.trigger('player:joined', { id, name }, (result: JoinResult) => result)[0];

  function newSocket() {
    socket = new FakeRoomSocket();
    socket.answers.set('room:create', SESSION);
    socket.answers.set('room:resume', { ok: false });
    sockets.push(socket);
    return socket.asRoomSocket();
  }

  beforeEach(async () => {
    sessionStorage.clear();
    sockets = [];
    seatResult = { personId: 'seat-1' };
    seats = new Set();
    vacated = [];
    renamed = [];
    TestBed.configureTestingModule({
      providers: [{ provide: CONNECT_TO_ROOM_SERVER, useValue: newSocket }],
    });
    host = TestBed.inject(RoomHostService);
    host.open(seating);
    await socket.connect();
  });

  it('should open a room once connected and show its code', () => {
    expect(host.isHosting()).toBe(true);
    expect(host.isConnected()).toBe(true);
    expect(host.code()).toBe(SESSION.code);
    expect(JSON.parse(sessionStorage.getItem(SESSION_KEY)!)).toEqual(SESSION);
  });

  it('should answer a join with the seat the page found', () => {
    expect(join('player-1')).toEqual({ ok: true });
  });

  it('should pass on why a player could not be seated', () => {
    seatResult = { refused: 'room_locked' };

    expect(join('player-1')).toEqual({ ok: false, reason: 'room_locked' });
  });

  it('should give a returning player their own seat back, and their card again', () => {
    join('player-1');
    host.deal(new Map([['seat-1', card({ characterId: 'seer' })]]));
    seatResult = { personId: 'seat-2' };

    expect(join('player-1')).toEqual({ ok: true });
    expect(socket.emittedOf('player:deal')).toEqual([
      ['player-1', card({ characterId: 'seer' })],
      ['player-1', card({ characterId: 'seer' })],
    ]);
    expect(seats.has('seat-2')).toBe(false);
  });

  it('should pass on a new name to the seat of the player who chose it', () => {
    join('player-1');
    socket.trigger('player:renamed', 'player-1', 'Annie');

    expect(renamed).toEqual([['seat-1', 'Annie']]);
  });

  it('should vacate the seat of a player who left for good', () => {
    join('player-1');
    socket.trigger('player:left', 'player-1');

    expect(vacated).toEqual(['seat-1']);
  });

  it('should deal each seated player their own card, and only when it changed', () => {
    join('player-1');
    host.deal(
      new Map([
        ['seat-1', card({ characterId: 'seer' })],
        ['seat-2', card()],
      ]),
    );
    host.deal(new Map([['seat-1', card({ characterId: 'seer' })]]));
    host.deal(new Map([['seat-1', card({ characterId: 'seer', isDead: true })]]));

    expect(socket.emittedOf('player:deal')).toEqual([
      ['player-1', card({ characterId: 'seer' })],
      ['player-1', card({ characterId: 'seer', isDead: true })],
    ]);
  });

  it('should kick the player in a seat without vacating it again', () => {
    join('player-1');
    host.kick('seat-1');

    expect(socket.emittedOf('player:kick')).toEqual([['player-1']]);
    expect(vacated).toEqual([]);
  });

  describe('when the connection drops', () => {
    beforeEach(() => {
      join('player-1');
      socket.answers.set('room:resume', { ok: true, playerIds: ['player-1'] });
      socket.drop();
    });

    it('should keep the room and its players while it is down', () => {
      expect(host.isConnected()).toBe(false);
      expect(host.code()).toBe(SESSION.code);
      expect(vacated).toEqual([]);
    });

    it('should take the same room back on reconnect', async () => {
      await socket.connect();

      expect(socket.emittedOf('room:resume')).toEqual([[SESSION]]);
      expect(socket.emittedOf('room:create')).toHaveLength(1);
      expect(host.isConnected()).toBe(true);
      expect(vacated).toEqual([]);
    });

    it('should let go of the players who left meanwhile', async () => {
      socket.answers.set('room:resume', { ok: true, playerIds: [] });
      await socket.connect();

      expect(vacated).toEqual(['seat-1']);
    });

    it('should open a new room when the old one is gone', async () => {
      socket.answers.set('room:resume', { ok: false });
      socket.answers.set('room:create', { code: '654321', hostKey: 'new-key' });
      await socket.connect();

      expect(vacated).toEqual(['seat-1']);
      expect(host.code()).toBe('654321');
    });
  });

  async function reload(playerIds: string[]) {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: CONNECT_TO_ROOM_SERVER, useValue: newSocket }],
    });
    const reloaded = TestBed.inject(RoomHostService);
    expect(reloaded.hasRoomToResume()).toBe(true);

    reloaded.open(seating);
    socket.answers.set('room:resume', { ok: true, playerIds });
    await socket.connect();
    await settle();
    return reloaded;
  }

  it('should take back the room this tab hosted before a reload', async () => {
    const reloaded = await reload([]);

    expect(socket.emittedOf('room:resume')).toEqual([[SESSION]]);
    expect(reloaded.code()).toBe(SESSION.code);
  });

  it('should give players their own seats back after a reload, even once seating is closed', async () => {
    join('player-1');
    seatResult = { refused: 'room_locked' };
    await reload(['player-1']);

    expect(join('player-1')).toEqual({ ok: true });
    expect(vacated).toEqual([]);
  });

  it('should let go of the players who left while the page was reloading', async () => {
    join('player-1');
    await reload([]);

    expect(vacated).toEqual(['seat-1']);
  });

  it('should close the room for good, and forget it', () => {
    join('player-1');
    seatResult = { personId: 'seat-2' };
    join('player-2');
    host.close();

    expect(sockets[0].emittedOf('room:close')).toHaveLength(1);
    expect(vacated).toEqual(['seat-1', 'seat-2']);
    expect(host.isHosting()).toBe(false);
    expect(host.code()).toBeNull();
    expect(host.hasRoomToResume()).toBe(false);
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });
});
