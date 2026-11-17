export class Throttle {
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly now: () => number;
  private attempts: number[] = [];

  constructor(limit: number, windowMs: number, now: () => number = Date.now) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.now = now;
  }

  tryAttempt(): boolean {
    const now = this.now();
    this.attempts = this.attempts.filter((time) => now - time < this.windowMs);
    if (this.attempts.length >= this.limit) {
      return false;
    }

    this.attempts.push(now);
    return true;
  }
}
