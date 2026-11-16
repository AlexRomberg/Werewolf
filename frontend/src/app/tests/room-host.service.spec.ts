import { TestBed } from '@angular/core/testing';
import type { JoinResult, PlayerCard } from '@protocol';
import { RoomHostService, RoomSeating, SeatResult } from '../services/room-host.service';
import { CONNECT_TO_ROOM_SERVER } from '../services/room-socket';
import { FakeRoomSocket } from './fake-room-socket';

function card(overrides: Partial<PlayerCard> = {}): PlayerCard {
  return {
    characterId: null,
    isDead: false,
    isWerewolf: false,
    isEnchanted: false,
    links: [],
    ...overrides,
  };
}

describe('RoomHostService', () => {
  let socket: FakeRoomSocket;
  let host: RoomHostService;
  let seatResult: SeatResult;
  let vacated: string[];
  const seating: RoomSeating = {
    seat: () => seatResult,
    vacate: (personId) => vacated.push(personId),
  };

  const join = (id: string, name = 'Anna') =>
    socket.trigger('player:joined', { id, name }, (result: JoinResult) => result);

  beforeEach(async () => {
    socket = new FakeRoomSocket();
    socket.answers.set('room:create', '42');
    seatResult = { personId: 'seat-1' };
    vacated = [];
    TestBed.configureTestingModule({
      providers: [{ provide: CONNECT_TO_ROOM_SERVER, useValue: () => socket.asRoomSocket() }],
    });
    host = TestBed.inject(RoomHostService);
    host.open(seating);
    await socket.connect();
  });

  it('should open a room once connected and show its code', () => {
    expect(host.isHosting()).toBe(true);
    expect(host.code()).toBe('42');
  });

  it('should answer a join with the seat the page found', () => {
    expect(join('player-1')).toEqual([{ ok: true }]);
    expect(host.isOccupied('seat-1')).toBe(true);
  });

  it('should pass on why a player could not be seated', () => {
    seatResult = { refused: 'room_locked' };

    expect(join('player-1')).toEqual([{ ok: false, reason: 'room_locked' }]);
    expect(host.isOccupied('seat-1')).toBe(false);
  });

  it('should vacate the seat of a player who left', () => {
    join('player-1');
    socket.trigger('player:left', 'player-1');

    expect(vacated).toEqual(['seat-1']);
    expect(host.isOccupied('seat-1')).toBe(false);
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

  it('should deal the current card to a player as soon as they are seated', () => {
    host.deal(new Map([['seat-1', card({ characterId: 'witch' })]]));
    join('player-1');

    expect(socket.emittedOf('player:deal')).toEqual([['player-1', card({ characterId: 'witch' })]]);
  });

  it('should kick the player in a seat without vacating it again', () => {
    join('player-1');
    host.kick('seat-1');

    expect(socket.emittedOf('player:kick')).toEqual([['player-1']]);
    expect(host.isOccupied('seat-1')).toBe(false);
    expect(vacated).toEqual([]);
  });

  it('should not kick anyone from a seat without a device', () => {
    host.kick('seat-1');

    expect(socket.emittedOf('player:kick')).toEqual([]);
  });

  it('should vacate every seat when the room closes', () => {
    join('player-1');
    seatResult = { personId: 'seat-2' };
    join('player-2');
    host.close();

    expect(vacated).toEqual(['seat-1', 'seat-2']);
    expect(host.isHosting()).toBe(false);
    expect(host.code()).toBeNull();
  });
});
