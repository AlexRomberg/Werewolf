import { Server, Socket } from "https://deno.land/x/socket_io@0.2.1/mod.ts";

const io = new Server({
    cors: {
        origin: "*"
    }
});

const rooms: Map<string, Room> = new Map();

io.on("connection", (socket) => {
    handleConnection(socket);

    socket.on("disconnect", handleDisconnect.bind(null, socket));
    socket.on("createRoom", handleCreateRoom.bind(null, socket));
});

function handleConnection(socket: Socket) {
    console.log(`[${socket.id}] socket connected`);
}

function handleDisconnect(socket: Socket) {
    console.log(`[${socket.id}] socket disconnected`);
}

function handleCreateRoom(socket: Socket, callback: (roomId: string) => void) {
    const roomId = Math.floor(Math.random() * 900000 + 100000);
    console.log(`[${socket.id}] Room created with ID: ${roomId}`);
    callback(roomId.toString());
}

Deno.serve({
    handler: io.handler(),
    port: 3000,
});

interface Room {
    admin: string;
    players: string[];
}
