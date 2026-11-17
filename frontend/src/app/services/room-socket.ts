import { InjectionToken } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '@protocol';

export type RoomSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const CONNECT_TO_ROOM_SERVER = new InjectionToken<() => RoomSocket>(
  'CONNECT_TO_ROOM_SERVER',
  {
    factory: () => () => io(),
  },
);
