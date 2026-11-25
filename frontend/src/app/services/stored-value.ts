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
