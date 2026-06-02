export interface LevelLayout {
  levelId: string;
  worldId: number;
  levelNumber: number;
  levelName: string;
  timeLimit: number;
  hasBoss: boolean;
  layout: string[];
}

const levelModules: Record<string, () => Promise<LevelLayout>> = {
  "1-1": () => import("./1-1.json").then((m) => m.default as LevelLayout),
  "1-2": () => import("./1-2.json").then((m) => m.default as LevelLayout),
  "1-3": () => import("./1-3.json").then((m) => m.default as LevelLayout),
  "2-1": () => import("./2-1.json").then((m) => m.default as LevelLayout),
  "2-2": () => import("./2-2.json").then((m) => m.default as LevelLayout),
  "2-3": () => import("./2-3.json").then((m) => m.default as LevelLayout),
  "3-1": () => import("./3-1.json").then((m) => m.default as LevelLayout),
  "3-2": () => import("./3-2.json").then((m) => m.default as LevelLayout),
  "3-3": () => import("./3-3.json").then((m) => m.default as LevelLayout),
};

export async function loadLevel(levelId: string): Promise<LevelLayout | null> {
  const loader = levelModules[levelId];
  if (!loader) return null;
  return loader();
}

export function getLevelIds(): string[] {
  return Object.keys(levelModules);
}
