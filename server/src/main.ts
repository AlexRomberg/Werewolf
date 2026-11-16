import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import {
  MAX_NAME_LENGTH,
  type ClientToServerEvents,
  type JoinRequest,
  type JoinResult,
  type ServerToClientEvents,
} from './protocol.ts';
import { Rooms } from './rooms.ts';

const PORT = Number(process.env['PORT'] ?? 3000);
/** How long a joining player waits for the host to find them a seat. */
const HOST_ANSWER_TIMEOUT_MS = 5000;

/** What the server remembers about each socket: the room it hosts, or the room it joined. */
interface SocketData {
  hostedCode?: string;
  joinedCode?: string;
}

type RoomSocket = Socket<ClientToServerEvents, ServerToClientEvents, never, SocketData>;

const rooms = new Rooms();

const httpServer = createServer((request, response) => {
  response.writeHead(request.url === '/health' ? 200 : 404).end();
});
const io = new Server<ClientToServerEvents, ServerToClientEvents, never, SocketData>(httpServer);

io.on('connection', (socket: RoomSocket) => {
  socket.on('room:create', (answer) => {
    if (typeof answer !== 'function') {
      return;
    }

    closeHostedRoom(socket);
    const code = rooms.open(socket.id);
    socket.data.hostedCode = code ?? undefined;
    answer(code);
  });

  socket.on('room:join', async (request, answer) => {
    if (typeof answer !== 'function') {
      return;
    }

    const result = await join(socket, request);
    console.log(
      `Join of room ${request?.code} as "${request?.name}": ${result.ok ? 'seated' : result.reason}`,
    );
    answer(result);
  });

  socket.on('player:kick', (playerId) => {
    const player = playerOfHost(socket, playerId);
    if (player) {
      player.emit('player:kicked');
      player.leave(String(player.data.joinedCode));
      player.data.joinedCode = undefined;
    }
  });

  socket.on('player:deal', (playerId, card) => {
    playerOfHost(socket, playerId)?.emit('player:dealt', card);
  });

  socket.on('disconnect', () => {
    closeHostedRoom(socket);
    leaveJoinedRoom(socket);
  });
});

async function join(socket: RoomSocket, request: JoinRequest | undefined): Promise<JoinResult> {
  // The request comes from an untrusted client, so its shape is not taken on faith.
  const code = String(request?.code ?? '');
  const name = String(request?.name ?? '')
    .trim()
    .slice(0, MAX_NAME_LENGTH);
  const host = socketById(rooms.hostOf(code));
  if (!host) {
    return { ok: false, reason: 'room_not_found' };
  }
  if (!name) {
    return { ok: false, reason: 'name_missing' };
  }

  leaveJoinedRoom(socket);
  // In the room before the host answers, so the card the host deals along with its answer arrives.
  socket.data.joinedCode = code;
  socket.join(code);

  let result: JoinResult;
  try {
    result = await host
      .timeout(HOST_ANSWER_TIMEOUT_MS)
      .emitWithAck('player:joined', { id: socket.id, name });
  } catch {
    result = { ok: false, reason: 'host_unreachable' };
  }

  // A player who disconnects meanwhile is reported to the host as left, like any other.
  if (!result.ok) {
    socket.leave(code);
    socket.data.joinedCode = undefined;
  }
  return result;
}

/** The socket of a player in the room the given host hosts, so a host can only reach its own players. */
function playerOfHost(host: RoomSocket, playerId: string) {
  const player = socketById(String(playerId));
  const code = host.data.hostedCode;
  return code && player?.data.joinedCode === code ? player : undefined;
}

function socketById(id: string | undefined): RoomSocket | undefined {
  return id ? io.sockets.sockets.get(id) : undefined;
}

function closeHostedRoom(socket: RoomSocket) {
  const code = socket.data.hostedCode;
  if (!code) {
    return;
  }

  io.to(code).emit('room:closed');
  io.in(code).socketsLeave(code);
  rooms.close(code);
  socket.data.hostedCode = undefined;
}

function leaveJoinedRoom(socket: RoomSocket) {
  const code = socket.data.joinedCode;
  if (!code) {
    return;
  }

  socketById(rooms.hostOf(code))?.emit('player:left', socket.id);
  socket.leave(code);
  socket.data.joinedCode = undefined;
}

httpServer.listen(PORT, () => console.log(`Werewolf room server listening on port ${PORT}`));
