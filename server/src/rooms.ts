import { randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { ROOM_CODE_LENGTH, SECRET_KEY_BYTES, type HostSession } from './protocol.ts';

const SMALLEST_CODE = 10 ** (ROOM_CODE_LENGTH - 1);
const LARGEST_CODE = 10 ** ROOM_CODE_LENGTH - 1;
export const CODE_COUNT = LARGEST_CODE - SMALLEST_CODE + 1;

export interface RoomMember {
  socketId: string | null;
  leaveTimer?: ReturnType<typeof setTimeout>;
}

export interface Room {
  code: string;
  hostKey: string;
  hostSocketId: string | null;
  closeTimer?: ReturnType<typeof setTimeout>;
  players: Map<string, RoomMember>;
}

export class Rooms {
  private readonly byCode = new Map<string, Room>();

  open(hostSocketId: string): Room | null {
    if (this.byCode.size >= CODE_COUNT) {
      return null;
    }

    let code: string;
    do {
      code = String(randomInt(SMALLEST_CODE, LARGEST_CODE + 1));
    } while (this.byCode.has(code));

    const room: Room = {
      code,
      hostKey: randomBytes(SECRET_KEY_BYTES).toString('base64url'),
      hostSocketId,
      players: new Map(),
    };
    this.byCode.set(code, room);
    return room;
  }

  get(code: string): Room | undefined {
    return this.byCode.get(code);
  }

  ofSession({ code, hostKey }: HostSession): Room | undefined {
    const room = this.byCode.get(code);
    return room && isSameSecret(room.hostKey, hostKey) ? room : undefined;
  }

  close(code: string) {
    const room = this.byCode.get(code);
    if (!room) {
      return;
    }

    clearTimeout(room.closeTimer);
    room.players.forEach((member) => clearTimeout(member.leaveTimer));
    this.byCode.delete(code);
  }
}

function isSameSecret(expected: string, given: string) {
  const expectedBytes = Buffer.from(expected);
  const givenBytes = Buffer.from(given);
  return expectedBytes.length === givenBytes.length && timingSafeEqual(expectedBytes, givenBytes);
}
