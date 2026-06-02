import Phaser from "phaser";

export class TileMapManager {
  private scene: Phaser.Scene;
  private map: Phaser.Tilemaps.Tilemap | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setMap(map: Phaser.Tilemaps.Tilemap): void {
    this.map = map;
  }

  addTileset(name: string, key: string): Phaser.Tilemaps.Tileset | null {
    if (!this.map) return null;
    return this.map.addTilesetImage(name, key) ?? null;
  }

  createLayer(
    layerName: string,
    tileset: Phaser.Tilemaps.Tileset
  ): Phaser.Tilemaps.TilemapLayer | null {
    if (!this.map) return null;
    return this.map.createLayer(layerName, tileset, 0, 0) ?? null;
  }

  setCollisionByExclusion(layer: Phaser.Tilemaps.TilemapLayer, indexes: number[]): void {
    layer.setCollisionByExclusion(indexes, true);
  }

  get worldWidth(): number {
    return this.map ? this.map.widthInPixels : 0;
  }

  get worldHeight(): number {
    return this.map ? this.map.heightInPixels : 0;
  }
}
