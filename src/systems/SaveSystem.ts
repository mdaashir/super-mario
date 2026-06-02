import { SAVE_SLOT_COUNT, SAVE_VERSION } from "../data/constants";

export interface SaveData {
  slotId: number;
  version: number;
  timestamp: number;
  checksum: string;
  currentWorld: number;
  currentLevel: number;
  checkpointPosition: { x: number; y: number } | null;
  score: number;
  remainingLives: number;
  unlockedWorlds: number[];
  unlockedLevels: Record<string, boolean>;
  audioSettings: { musicVolume: number; sfxVolume: number };
  controlBindings: Record<string, string>;
  totalCoinsCollected: number;
  worldHighScores: Record<string, number>;
}

function computeChecksum(data: Record<string, unknown>): string {
  const { checksum: _, ...rest } = data;
  let hash = 0;
  const str = JSON.stringify(rest);
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

function storageKey(slotId: number): string {
  return `super-mario-save-${slotId}`;
}

function backupKey(slotId: number): string {
  return `super-mario-save-${slotId}-bak`;
}

export class SaveSystem {
  private currentSlot: number = 0;

  setSlot(slot: number): void {
    if (slot >= 0 && slot < SAVE_SLOT_COUNT) {
      this.currentSlot = slot;
    }
  }

  getSlots(): { slot: number; hasSave: boolean; timestamp?: number }[] {
    const slots: { slot: number; hasSave: boolean; timestamp?: number }[] = [];
    for (let i = 0; i < SAVE_SLOT_COUNT; i++) {
      const raw = localStorage.getItem(storageKey(i));
      if (raw) {
        try {
          const data = JSON.parse(raw) as SaveData;
          slots.push({ slot: i, hasSave: true, timestamp: data.timestamp });
        } catch {
          slots.push({ slot: i, hasSave: false });
        }
      } else {
        slots.push({ slot: i, hasSave: false });
      }
    }
    return slots;
  }

  save(data: Omit<SaveData, "checksum" | "timestamp" | "version" | "slotId">): boolean {
    const saveData: SaveData = {
      slotId: this.currentSlot,
      version: SAVE_VERSION,
      timestamp: Date.now(),
      checksum: "",
      ...data,
    };
    saveData.checksum = computeChecksum(saveData as unknown as Record<string, unknown>);

    try {
      const serialized = JSON.stringify(saveData);
      localStorage.setItem(storageKey(this.currentSlot), serialized);
      localStorage.setItem(backupKey(this.currentSlot), serialized);
      return true;
    } catch {
      return false;
    }
  }

  load(): SaveData | null {
    const primary = this.tryLoad(storageKey(this.currentSlot));
    if (primary && this.validate(primary)) return primary;

    const backup = this.tryLoad(backupKey(this.currentSlot));
    if (backup && this.validate(backup)) return backup;

    return null;
  }

  deleteSlot(slot: number): void {
    localStorage.removeItem(storageKey(slot));
    localStorage.removeItem(backupKey(slot));
  }

  private tryLoad(key: string): SaveData | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as SaveData;
    } catch {
      return null;
    }
  }

  private validate(data: SaveData): boolean {
    if (data.version !== SAVE_VERSION) return false;
    if (data.slotId < 0 || data.slotId >= SAVE_SLOT_COUNT) return false;
    if (data.remainingLives < 0 || data.remainingLives > 99) return false;
    if (data.score < 0) return false;

    const expected = computeChecksum(data as unknown as Record<string, unknown>);
    if (data.checksum !== expected) return false;

    return true;
  }
}
