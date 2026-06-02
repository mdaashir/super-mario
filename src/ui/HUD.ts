import Phaser from "phaser";

export class HUD {
  private scene: Phaser.Scene;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.create();
  }

  private create(): void {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3,
    };

    this.scoreText = this.scene.add.text(16, 16, "SCORE: 0", style).setScrollFactor(0).setDepth(100);
    this.livesText = this.scene.add.text(16, 36, "LIVES: 3", style).setScrollFactor(0).setDepth(100);
    this.timerText = this.scene.add.text(700, 16, "TIME: 0", style).setScrollFactor(0).setDepth(100);
  }

  updateScore(score: number): void {
    this.scoreText.setText(`SCORE: ${score}`);
  }

  updateLives(lives: number): void {
    this.livesText.setText(`LIVES: ${lives}`);
  }

  updateTimer(seconds: number): void {
    this.timerText.setText(`TIME: ${seconds}`);
  }
}
