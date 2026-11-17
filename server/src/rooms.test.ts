import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ROOM_CODE_PATTERN } from './protocol.ts';
import { Rooms } from './rooms.ts';
import { Throttle } from './throttle.ts';

test('a room gets a code that leads back to it, and a secret key for its host', () => {
  const rooms = new Rooms();
  const room = rooms.open('host-socket');

  assert.ok(room);
  assert.match(room.code, ROOM_CODE_PATTERN);
  assert.doesNotMatch(room.code, /^0/);
  assert.ok(room.hostKey.length >= 22);
  assert.equal(rooms.get(room.code), room);
});

test('rooms never share a code', () => {
  const rooms = new Rooms();
  const codes = new Set(
    Array.from({ length: 1000 }, (_, index) => rooms.open(`host-${index}`)?.code),
  );

  assert.equal(codes.size, 1000);
});

test('a host takes its room back only with the right key', () => {
  const rooms = new Rooms();
  const room = rooms.open('host-socket')!;

  assert.equal(rooms.ofSession({ code: room.code, hostKey: room.hostKey }), room);
  assert.equal(rooms.ofSession({ code: room.code, hostKey: 'guessed' }), undefined);
  assert.equal(rooms.ofSession({ code: '000000', hostKey: room.hostKey }), undefined);
});

test('a closed room can no longer be found', () => {
  const rooms = new Rooms();
  const room = rooms.open('host-socket')!;
  rooms.close(room.code);

  assert.equal(rooms.get(room.code), undefined);
});

test('a throttle allows a limited number of attempts per window', () => {
  let now = 0;
  const throttle = new Throttle(2, 1000, () => now);

  assert.equal(throttle.tryAttempt(), true);
  assert.equal(throttle.tryAttempt(), true);
  assert.equal(throttle.tryAttempt(), false);

  now = 1000;
  assert.equal(throttle.tryAttempt(), true);
});
