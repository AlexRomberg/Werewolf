export class MemoryStorage implements Storage {
  private readonly items = new Map<string, string>();

  get length() {
    return this.items.size;
  }

  clear() {
    this.items.clear();
  }

  getItem(key: string) {
    return this.items.get(key) ?? null;
  }

  key(index: number) {
    return [...this.items.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.items.delete(key);
  }

  setItem(key: string, value: string) {
    this.items.set(key, String(value));
  }
}

export function useMemoryLocalStorage() {
  const storage = new MemoryStorage();
  const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
  Object.defineProperty(window, 'localStorage', { value: storage, configurable: true });
  onTestFinished(() => {
    if (original) {
      Object.defineProperty(window, 'localStorage', original);
    } else {
      delete (window as { localStorage?: Storage }).localStorage;
    }
  });
  return storage;
}
