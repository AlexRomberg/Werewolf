import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ROOM_CODE_PATTERN } from './protocol.ts';
import { CODE_COUNT, Rooms } from './rooms.ts';

test('a room gets a code that leads back to its host', () => {
  const rooms = new Rooms();
  const code = rooms.open('host-socket');

  assert.ok(code);
  assert.match(code, ROOM_CODE_PATTERN);
  assert.doesNotMatch(code, /^0/);
  assert.equal(rooms.hostOf(code), 'host-socket');
});

test('rooms never share a code, and none opens once every code is taken', () => {
  const rooms = new Rooms();
  const codes = new Set(Array.from({ length: CODE_COUNT }, (_, index) => rooms.open(`host-${index}`)));

  assert.equal(codes.size, CODE_COUNT);
  assert.ok(!codes.has(null));
  assert.equal(rooms.open('one-too-many'), null);
});

test('a closed room can no longer be found, and frees its code', () => {
  const rooms = new Rooms();
  const code = rooms.open('host-socket');
  assert.ok(code);
  rooms.close(code);

  assert.equal(rooms.hostOf(code), undefined);
});
