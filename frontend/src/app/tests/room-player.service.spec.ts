import { TestBed } from '@angular/core/testing';
import { KEY_PATTERN, type PlayerCard } from '@protocol';
import { RoomPlayerService } from '../services/room-player.service';
import { CONNECT_TO_ROOM_SERVER } from '../services/room-socket';
import { FakeRoomSocket, settle } from './fake-room-socket';
import { useMemoryLocalStorage } from './memory-storage';

const CODE = '123456';
const SEAT_KEY = `werewolf:seat:${CODE}`;

const SEER_CARD: PlayerCard = {
  name: 'Anna',
  characterId: 'seer',
  isDead: false,
  isWerewolf: false,
  isEnchanted: false,
  links: [{ type: 'love', name: 'Ben' }],
};

describe('RoomPlayerService', () => {
  let sockets: FakeRoomSocket[];
  let socket: FakeRoomSocket;
  let player: RoomPlayerService;

  let storage: Storage;
  const heldSeat = () => JSON.parse(storage.getItem(SEAT_KEY) ?? 'null');
  const joinRequests = () => socket.emittedOf('room:join').map(([request]) => request);

  beforeEach(() => {
    storage = useMemoryLocalStorage();
    sockets = [];
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CONNECT_TO_ROOM_SERVER,
          useValue: () => {
            socket = new FakeRoomSocket();
            socket.answers.set('room:join', { ok: true });
            sockets.push(socket);
            return socket.asRoomSocket();
          },
        },
      ],
    });
    player = TestBed.inject(RoomPlayerService);
  });

  it('should join under a secret id it keeps for the room', async () => {
    player.join(CODE, 'Anna');
    expect(player.status()).toBe('joining');
    await socket.connect();

    const [request] = joinRequests() as { code: string; playerId: string; name: string }[];
    expect(request).toMatchObject({ code: CODE, name: 'Anna' });
    expect(request.playerId).toMatch(KEY_PATTERN);
    expect(heldSeat()).toEqual({ playerId: request.playerId, name: 'Anna' });
    expect(player.status()).toBe('joined');
  });

  it('should take the same seat back after a reload', async () => {
    player.join(CODE, 'Anna');
    await socket.connect();
    const firstId = heldSeat().playerId;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CONNECT_TO_ROOM_SERVER,
          useValue: () => {
            socket = new FakeRoomSocket();
            socket.answers.set('room:join', { ok: true });
            return socket.asRoomSocket();
          },
        },
      ],
    });
    const reloaded = TestBed.inject(RoomPlayerService);
    expect(reloaded.rejoin(CODE)).toBe(true);
    await socket.connect();

    expect(joinRequests()).toEqual([{ code: CODE, playerId: firstId, name: 'Anna' }]);
    expect(reloaded.status()).toBe('joined');
  });

  it('should hold no seat in a room it never joined', () => {
    expect(player.rejoin(CODE)).toBe(false);
    expect(player.status()).toBe('outside');
  });

  it('should ask for its seat again after its own connection dropped', async () => {
    player.join(CODE, 'Anna');
    await socket.connect();
    socket.drop();
    expect(player.status()).toBe('reconnecting');

    await socket.connect();
    expect(joinRequests()).toHaveLength(2);
    expect(player.status()).toBe('joined');
  });

  it('should wait for a host that is away, and ask again once it is back', async () => {
    player.join(CODE, 'Anna');
    await socket.connect();
    socket.trigger('host:away');
    expect(player.status()).toBe('host_away');

    socket.trigger('host:back');
    await settle();
    expect(joinRequests()).toHaveLength(2);
    expect(player.status()).toBe('joined');
  });

  it('should keep its card while a connection is down', async () => {
    player.join(CODE, 'Anna');
    await socket.connect();
    socket.trigger('player:dealt', SEER_CARD);
    socket.drop();

    expect(player.card()).toEqual(SEER_CARD);
  });

  it('should tell the host a new name, and keep it for rejoining', async () => {
    player.join(CODE, 'Anna');
    await socket.connect();
    player.rename('  Annie ');

    expect(socket.emittedOf('player:rename')).toEqual([['Annie']]);
    expect(player.name()).toBe('Annie');
    expect(heldSeat().name).toBe('Annie');
  });

  it('should show why the room turned the player away', async () => {
    player.join(CODE, 'Anna');
    socket.answers.set('room:join', { ok: false, reason: 'room_locked' });
    await socket.connect();

    expect(player.status()).toBe('room_locked');
    expect(socket.connected).toBe(false);
  });

  it('should forget the seat when the narrator kicks the player', async () => {
    player.join(CODE, 'Anna');
    await socket.connect();
    socket.trigger('player:dealt', SEER_CARD);
    socket.trigger('player:kicked');

    expect(player.status()).toBe('kicked');
    expect(player.card()).toBeNull();
    expect(heldSeat()).toBeNull();
  });

  it('should keep the seat when the card moved to another device, to take it back', async () => {
    player.join(CODE, 'Anna');
    await socket.connect();
    socket.trigger('player:moved');

    expect(player.status()).toBe('moved');
    expect(heldSeat()).not.toBeNull();
  });

  it('should give the seat up for good when leaving', async () => {
    player.join(CODE, 'Anna');
    await socket.connect();
    const leavingSocket = socket;
    player.leave();

    expect(leavingSocket.emittedOf('room:leave')).toHaveLength(1);
    expect(heldSeat()).toBeNull();
    expect(player.status()).toBe('outside');
  });

  it('should tell the player when the room closes', async () => {
    player.join(CODE, 'Anna');
    await socket.connect();
    socket.trigger('room:closed');

    expect(player.status()).toBe('room_closed');
    expect(heldSeat()).toBeNull();
  });
});
