import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import {
  KEY_PATTERN,
  MAX_NAME_LENGTH,
  MAX_PLAYERS,
  ROOM_CODE_PATTERN,
  type ClientToServerEvents,
  type HostSession,
  type JoinRequest,
  type JoinResult,
  type RoomPlayer,
  type ServerToClientEvents,
} from './protocol.ts';
import { Rooms, type Room, type RoomMember } from './rooms.ts';
import { Throttle } from './throttle.ts';

const PORT = Number(process.env['PORT'] ?? 3000);
const HOST_ANSWER_TIMEOUT_MS = 5_000;
const HOST_GRACE_MS = 15 * 60_000;
const PLAYER_GRACE_MS = 10 * 60_000;
const MAX_MESSAGE_BYTES = 16 * 1024;
const THROTTLE_WINDOW_MS = 60_000;
const JOIN_ATTEMPTS_PER_WINDOW = 10;
const ROOM_ATTEMPTS_PER_WINDOW = 5;

interface SocketData {
  hostedCode?: string;
  joinedCode?: string;
  playerId?: string;
  joinThrottle: Throttle;
  roomThrottle: Throttle;
}

type RoomSocket = Socket<ClientToServerEvents, ServerToClientEvents, never, SocketData>;

const rooms = new Rooms();

const httpServer = createServer((request, response) => {
  response.writeHead(request.url === '/health' ? 200 : 404).end();
});
const io = new Server<ClientToServerEvents, ServerToClientEvents, never, SocketData>(httpServer, {
  maxHttpBufferSize: MAX_MESSAGE_BYTES,
});

io.on('connection', (socket: RoomSocket) => {
  socket.data.joinThrottle = new Throttle(JOIN_ATTEMPTS_PER_WINDOW, THROTTLE_WINDOW_MS);
  socket.data.roomThrottle = new Throttle(ROOM_ATTEMPTS_PER_WINDOW, THROTTLE_WINDOW_MS);

  socket.on('room:create', (answer) => {
    if (typeof answer !== 'function') {
      return;
    }
    if (!socket.data.roomThrottle.tryAttempt()) {
      answer(null);
      return;
    }

    closeRoom(hostedRoom(socket));
    const room = rooms.open(socket.id);
    socket.data.hostedCode = room?.code;
    answer(room && { code: room.code, hostKey: room.hostKey });
  });

  socket.on('room:resume', (session, answer) => {
    if (typeof answer !== 'function') {
      return;
    }

    const room = socket.data.roomThrottle.tryAttempt() ? roomOfSession(session) : undefined;
    if (!room) {
      answer({ ok: false });
      return;
    }

    const previousHost = room.hostSocketId;
    room.hostSocketId = socket.id;
    socketById(previousHost)?.disconnect(true);
    clearTimeout(room.closeTimer);
    socket.data.hostedCode = room.code;
    io.to(room.code).emit('host:back');
    answer({ ok: true, playerIds: [...room.players.keys()] });
  });

  socket.on('room:close', () => closeRoom(hostedRoom(socket)));

  socket.on('player:kick', (playerId) => {
    const room = hostedRoom(socket);
    const member = room?.players.get(String(playerId));
    if (!room || !member) {
      return;
    }

    clearTimeout(member.leaveTimer);
    room.players.delete(String(playerId));
    const player = socketById(member.socketId);
    player?.emit('player:kicked');
    if (player) {
      forgetMembership(player);
    }
  });

  socket.on('player:deal', (playerId, card) => {
    const member = hostedRoom(socket)?.players.get(String(playerId));
    socketById(member?.socketId)?.emit('player:dealt', card);
  });

  socket.on('room:join', async (request, answer) => {
    if (typeof answer !== 'function') {
      return;
    }

    const reply = await join(socket, request);
    console.log(
      `Join of room ${socket.data.joinedCode ?? '-'}: ${reply.ok ? 'seated' : reply.reason}`,
    );
    answer(reply);
  });

  socket.on('room:leave', () => {
    const room = joinedRoom(socket);
    const playerId = socket.data.playerId;
    if (room && playerId && room.players.get(playerId)?.socketId === socket.id) {
      room.players.delete(playerId);
      hostOf(room)?.emit('player:left', playerId);
    }
    forgetMembership(socket);
  });

  socket.on('player:rename', (name) => {
    const room = joinedRoom(socket);
    const playerId = socket.data.playerId;
    const cleanName = cleanedName(name);
    if (room && playerId && cleanName && room.players.get(playerId)?.socketId === socket.id) {
      hostOf(room)?.emit('player:renamed', playerId, cleanName);
    }
  });

  socket.on('disconnect', () => {
    const hosted = hostedRoom(socket);
    if (hosted) {
      hosted.hostSocketId = null;
      io.to(hosted.code).emit('host:away');
      hosted.closeTimer = setTimeout(() => closeRoom(hosted), HOST_GRACE_MS);
    }

    const room = joinedRoom(socket);
    const playerId = socket.data.playerId;
    const member = playerId ? room?.players.get(playerId) : undefined;
    if (room && playerId && member?.socketId === socket.id) {
      member.socketId = null;
      member.leaveTimer = setTimeout(() => {
        room.players.delete(playerId);
        hostOf(room)?.emit('player:left', playerId);
      }, PLAYER_GRACE_MS);
    }
  });
});

async function join(socket: RoomSocket, request: unknown): Promise<JoinResult> {
  if (!socket.data.joinThrottle.tryAttempt()) {
    return { ok: false, reason: 'too_many_attempts' };
  }

  const joinRequest = parseJoinRequest(request);
  if (!joinRequest) {
    return { ok: false, reason: 'invalid_request' };
  }

  const { code, playerId, name } = joinRequest;
  const room = rooms.get(code);
  if (!room) {
    return { ok: false, reason: 'room_not_found' };
  }

  const known = room.players.get(playerId);
  if (!known && room.players.size >= MAX_PLAYERS) {
    return { ok: false, reason: 'room_full' };
  }

  enterRoom(socket, code, playerId);
  if (known) {
    moveToSocket(known, socket);
  }

  const host = hostOf(room);
  if (!host) {
    return { ok: false, reason: 'host_away' };
  }

  room.players.set(playerId, known ?? { socketId: socket.id });
  const reply = await askHost(host, { id: playerId, name });
  if (!reply.ok && reply.reason !== 'host_away') {
    room.players.delete(playerId);
    forgetMembership(socket);
  }
  return reply;
}

function parseJoinRequest(request: unknown): JoinRequest | null {
  const { code, playerId, name } = (request ?? {}) as Record<string, unknown>;
  const cleanName = cleanedName(name);
  if (
    typeof code !== 'string' ||
    !ROOM_CODE_PATTERN.test(code) ||
    typeof playerId !== 'string' ||
    !KEY_PATTERN.test(playerId) ||
    !cleanName
  ) {
    return null;
  }
  return { code, playerId, name: cleanName };
}

function enterRoom(socket: RoomSocket, code: string, playerId: string) {
  if (socket.data.joinedCode !== code || socket.data.playerId !== playerId) {
    forgetMembership(socket);
  }
  socket.join(code);
  socket.data.joinedCode = code;
  socket.data.playerId = playerId;
}

function moveToSocket(member: RoomMember, socket: RoomSocket) {
  const previousSocket = socketById(member.socketId);
  if (previousSocket && previousSocket !== socket) {
    previousSocket.emit('player:moved');
    forgetMembership(previousSocket);
  }
  clearTimeout(member.leaveTimer);
  member.socketId = socket.id;
}

async function askHost(host: RoomSocket, player: RoomPlayer): Promise<JoinResult> {
  try {
    return await host.timeout(HOST_ANSWER_TIMEOUT_MS).emitWithAck('player:joined', player);
  } catch {
    return { ok: false, reason: 'host_away' };
  }
}

function closeRoom(room: Room | undefined) {
  if (!room) {
    return;
  }

  io.to(room.code).emit('room:closed');
  io.in(room.code).socketsLeave(room.code);
  const host = hostOf(room);
  if (host) {
    host.data.hostedCode = undefined;
  }
  rooms.close(room.code);
}

function forgetMembership(socket: RoomSocket) {
  if (socket.data.joinedCode) {
    socket.leave(socket.data.joinedCode);
  }
  socket.data.joinedCode = undefined;
  socket.data.playerId = undefined;
}

function hostedRoom(socket: RoomSocket): Room | undefined {
  const room = socket.data.hostedCode ? rooms.get(socket.data.hostedCode) : undefined;
  return room?.hostSocketId === socket.id ? room : undefined;
}

function joinedRoom(socket: RoomSocket): Room | undefined {
  return socket.data.joinedCode ? rooms.get(socket.data.joinedCode) : undefined;
}

function hostOf(room: Room): RoomSocket | undefined {
  return socketById(room.hostSocketId);
}

function roomOfSession(session: unknown): Room | undefined {
  const { code, hostKey } = (session ?? {}) as Partial<Record<keyof HostSession, unknown>>;
  return typeof code === 'string' && typeof hostKey === 'string'
    ? rooms.ofSession({ code, hostKey })
    : undefined;
}

function socketById(id: string | null | undefined): RoomSocket | undefined {
  return id ? io.sockets.sockets.get(id) : undefined;
}

function cleanedName(name: unknown) {
  return typeof name === 'string' ? name.trim().slice(0, MAX_NAME_LENGTH) : '';
}

httpServer.listen(PORT, () => console.log(`Werewolf room server listening on port ${PORT}`));
