export class ObjectPool<T extends Phaser.GameObjects.GameObject> {
  private pool: T[] = [];
  private factory: () => T;
  private reset: (obj: T) => void;

  constructor(factory: () => T, reset: (obj: T) => void, preAllocate: number = 0) {
    this.factory = factory;
    this.reset = reset;
    for (let i = 0; i < preAllocate; i++) {
      const obj = this.factory();
      obj.setActive(false);
      this.pool.push(obj);
    }
  }

  get(): T {
    let obj = this.pool.find((o) => !o.active);
    if (!obj) {
      obj = this.factory();
    } else {
      this.reset(obj);
    }
    obj.setActive(true);
    return obj;
  }

  release(obj: T): void {
    obj.setActive(false);
  }

  releaseAll(): void {
    for (const obj of this.pool) {
      if (obj.active) {
        this.release(obj);
      }
    }
  }

  getActiveCount(): number {
    return this.pool.filter((o) => o.active).length;
  }

  getTotalSize(): number {
    return this.pool.length;
  }
}
