import { randomInt } from 'node:crypto';
import { ROOM_CODE_LENGTH } from './protocol.ts';

const SMALLEST_CODE = 10 ** (ROOM_CODE_LENGTH - 1);
const LARGEST_CODE = 10 ** ROOM_CODE_LENGTH - 1;
export const CODE_COUNT = LARGEST_CODE - SMALLEST_CODE + 1;

/** The open rooms, each known by its code and owned by the socket that hosts it. */
export class Rooms {
  private readonly hostIdByCode = new Map<string, string>();

  /** Opens a room for the given host socket and returns its fresh code, or `null` when every code is in use. */
  open(hostId: string): string | null {
    if (this.hostIdByCode.size >= CODE_COUNT) {
      return null;
    }

    let code: string;
    do {
      code = String(randomInt(SMALLEST_CODE, LARGEST_CODE + 1));
    } while (this.hostIdByCode.has(code));

    this.hostIdByCode.set(code, hostId);
    return code;
  }

  hostOf(code: string): string | undefined {
    return this.hostIdByCode.get(code);
  }

  close(code: string) {
    this.hostIdByCode.delete(code);
  }
}
