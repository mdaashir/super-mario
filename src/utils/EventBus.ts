type EventCallback = (...args: unknown[]) => void;

const events = new Map<string, Set<EventCallback>>();

export const EventBus = {
  on(event: string, callback: EventCallback): void {
    if (!events.has(event)) {
      events.set(event, new Set());
    }
    events.get(event)!.add(callback);
  },

  off(event: string, callback?: EventCallback): void {
    if (callback) {
      const callbacks = events.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          events.delete(event);
        }
      }
    } else {
      events.delete(event);
    }
  },

  emit(event: string, ...args: unknown[]): void {
    const callbacks = events.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(...args));
    }
  },

  clear(): void {
    events.clear();
  },
};
