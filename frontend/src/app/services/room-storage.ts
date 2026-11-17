import { ROOM_CODE_LENGTH } from '@protocol';

export class StoredValue<T> {
  constructor(
    private storage: Storage | undefined,
    private key: string,
    private isValid: (value: unknown) => value is T,
  ) {}

  read(): T | null {
    try {
      const value: unknown = JSON.parse(this.storage?.getItem(this.key) ?? 'null');
      return this.isValid(value) ? value : null;
    } catch {
      return null;
    }
  }

  write(value: T) {
    try {
      this.storage?.setItem(this.key, JSON.stringify(value));
    } catch {}
  }

  remove() {
    try {
      this.storage?.removeItem(this.key);
    } catch {}
  }
}

export function newSecretKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

const CODE_HALF = Math.ceil(ROOM_CODE_LENGTH / 2);

export function formatRoomCode(code: string) {
  return `${code.slice(0, CODE_HALF)}-${code.slice(CODE_HALF)}`;
}

export const ROOM_CODE_INPUT_PATTERN = new RegExp(
  `^\\s*\\d{${CODE_HALF}}[\\s-]?\\d{${ROOM_CODE_LENGTH - CODE_HALF}}\\s*$`,
);

export function normalizeRoomCode(input: string) {
  return input.replace(/\D/g, '');
}
