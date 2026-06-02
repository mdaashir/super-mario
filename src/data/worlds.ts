export interface WorldDefinition {
  id: number;
  name: string;
  theme: string;
  description: string;
  levelCount: number;
  musicKey: string;
}

export const WORLDS: WorldDefinition[] = [
  { id: 1, name: "World 1", theme: "Grassland", description: "Green Plains", levelCount: 3, musicKey: "music-world1" },
  { id: 2, name: "World 2", theme: "Desert", description: "Sandy Expanse", levelCount: 3, musicKey: "music-world2" },
  { id: 3, name: "World 3", theme: "Lava", description: "Fiery Depths", levelCount: 3, musicKey: "music-world3" },
];
