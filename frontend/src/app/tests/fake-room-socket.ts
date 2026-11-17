import { RoomSocket } from '../services/room-socket';

type Listener = (...args: unknown[]) => unknown;

export class FakeRoomSocket {
  connected = false;
  readonly answers = new Map<string, unknown>();
  readonly emitted: { event: string; args: unknown[] }[] = [];
  private readonly listeners = new Map<string, Listener[]>();

  on(event: string, listener: Listener) {
    this.listeners.set(event, [...(this.listeners.get(event) ?? []), listener]);
    return this;
  }

  emit(event: string, ...args: unknown[]) {
    this.emitted.push({ event, args });
    return this;
  }

  async emitWithAck(event: string, ...args: unknown[]) {
    this.emitted.push({ event, args });
    const answer = this.answers.get(event);
    return typeof answer === 'function' ? answer(...args) : answer;
  }

  disconnect() {
    if (this.connected) {
      this.connected = false;
      this.trigger('disconnect', 'io client disconnect');
    }
    return this;
  }

  async connect() {
    this.connected = true;
    this.trigger('connect');
    await settle();
  }

  drop() {
    this.connected = false;
    this.trigger('disconnect', 'transport close');
  }

  trigger(event: string, ...args: unknown[]) {
    return (this.listeners.get(event) ?? []).map((listener) => listener(...args));
  }

  emittedOf(event: string) {
    return this.emitted.filter((entry) => entry.event === event).map((entry) => entry.args);
  }

  asRoomSocket() {
    return this as unknown as RoomSocket;
  }
}

export function settle() {
  return new Promise((resolve) => setTimeout(resolve));
}
