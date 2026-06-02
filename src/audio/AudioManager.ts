import Phaser from "phaser";

type SoundWithVolume = Phaser.Sound.BaseSound & { volume: number };

export class AudioManager {
  private scene: Phaser.Scene;
  private currentMusic: SoundWithVolume | null = null;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.5;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setMusicVolume(vol: number): void {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.currentMusic) {
      this.currentMusic.volume = this.musicVolume;
    }
  }

  setSfxVolume(vol: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  playMusic(key: string): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
    }
    const sound = this.scene.sound.add(key, { loop: true, volume: this.musicVolume }) as SoundWithVolume;
    this.currentMusic = sound;
    sound.play();
  }

  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  playSfx(key: string): void {
    this.scene.sound.play(key, { volume: this.sfxVolume });
  }
}
