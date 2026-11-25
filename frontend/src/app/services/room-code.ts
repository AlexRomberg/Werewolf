import { ROOM_CODE_LENGTH } from '@protocol';

const CODE_HALF = Math.ceil(ROOM_CODE_LENGTH / 2);

export const ROOM_CODE_INPUT_PATTERN = new RegExp(
  `^\\s*\\d{${CODE_HALF}}[\\s-]?\\d{${ROOM_CODE_LENGTH - CODE_HALF}}\\s*$`,
);

export function formatRoomCode(code: string) {
  return `${code.slice(0, CODE_HALF)}-${code.slice(CODE_HALF)}`;
}

export function normalizeRoomCode(input: string) {
  return input.replace(/\D/g, '');
}
