import { RoomSocket } from '../services/room-socket';

type Listener = (...args: unknown[]) => unknown;

/** Stands in for a socket.io connection: tests play the server by triggering its events. */
export class FakeRoomSocket {
  connected = false;
  /** What the server answers to an acknowledged event, by event name. */
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
    return this.answers.get(event);
  }

  disconnect() {
    if (this.connected) {
      this.connected = false;
      this.trigger('disconnect', 'io client disconnect');
    }
    return this;
  }

  /** Connects, and waits for whatever the socket's `connect` listeners ask the server. */
  async connect() {
    this.connected = true;
    this.trigger('connect');
    await settle();
  }

  /** Delivers a server event, returning what each listener answered. */
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
