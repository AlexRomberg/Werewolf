import { TestBed } from '@angular/core/testing';
import type { PlayerCard } from '@protocol';
import { RoomPlayerService } from '../services/room-player.service';
import { CONNECT_TO_ROOM_SERVER } from '../services/room-socket';
import { FakeRoomSocket } from './fake-room-socket';

const SEER_CARD: PlayerCard = {
  characterId: 'seer',
  isDead: false,
  isWerewolf: false,
  isEnchanted: false,
  links: [{ type: 'love', name: 'Ben' }],
};

describe('RoomPlayerService', () => {
  let socket: FakeRoomSocket;
  let player: RoomPlayerService;

  beforeEach(() => {
    socket = new FakeRoomSocket();
    socket.answers.set('room:join', { ok: true });
    TestBed.configureTestingModule({
      providers: [{ provide: CONNECT_TO_ROOM_SERVER, useValue: () => socket.asRoomSocket() }],
    });
    player = TestBed.inject(RoomPlayerService);
  });

  it('should join the room under the given name once connected', async () => {
    player.join({ code: '42', name: 'Anna' });
    expect(player.status()).toBe('joining');

    await socket.connect();

    expect(socket.emittedOf('room:join')).toEqual([[{ code: '42', name: 'Anna' }]]);
    expect(player.status()).toBe('joined');
  });

  it('should show why the room turned the player away', async () => {
    socket.answers.set('room:join', { ok: false, reason: 'room_locked' });
    player.join({ code: '42', name: 'Anna' });
    await socket.connect();

    expect(player.status()).toBe('room_locked');
    expect(socket.connected).toBe(false);
  });

  it('should hold the card the host dealt', async () => {
    player.join({ code: '42', name: 'Anna' });
    await socket.connect();
    socket.trigger('player:dealt', SEER_CARD);

    expect(player.card()).toEqual(SEER_CARD);
  });

  it('should drop the card when the narrator kicks the player', async () => {
    player.join({ code: '42', name: 'Anna' });
    await socket.connect();
    socket.trigger('player:dealt', SEER_CARD);
    socket.trigger('player:kicked');

    expect(player.status()).toBe('kicked');
    expect(player.card()).toBeNull();
  });

  it('should tell the player when the room closes', async () => {
    player.join({ code: '42', name: 'Anna' });
    await socket.connect();
    socket.trigger('room:closed');

    expect(player.status()).toBe('room_closed');
  });

  it('should show the player as rejoining while the connection is lost', async () => {
    player.join({ code: '42', name: 'Anna' });
    await socket.connect();
    socket.trigger('disconnect', 'transport close');

    expect(player.status()).toBe('joining');
  });
});
