import { EventBus } from "../utils/EventBus";
import { EXTRA_LIVE_THRESHOLD } from "../data/constants";

export class ScoreSystem {
  private score: number = 0;
  private coinsCollected: number = 0;
  private coinScoreTotal: number = 0;
  private extraLivesEarned: number = 0;

  constructor() {
    EventBus.on("coin-collected", (coinScore: unknown) => {
      this.addCoin(typeof coinScore === "number" ? coinScore : 0);
    });

    EventBus.on("enemy-defeated", (enemyScore: unknown) => {
      this.addScore(typeof enemyScore === "number" ? enemyScore : 0);
    });
  }

  getScore(): number {
    return this.score;
  }

  getCoinsCollected(): number {
    return this.coinsCollected;
  }

  getExtraLivesEarned(): number {
    return this.extraLivesEarned;
  }

  reset(): void {
    this.score = 0;
    this.coinsCollected = 0;
    this.coinScoreTotal = 0;
  }

  private addScore(points: number): void {
    this.score += points;
    EventBus.emit("score-updated", this.score);
  }

  private addCoin(scoreValue: number): void {
    this.coinsCollected++;
    this.coinScoreTotal += scoreValue;
    this.score += scoreValue;

    if (this.coinsCollected % EXTRA_LIVE_THRESHOLD === 0) {
      this.extraLivesEarned++;
      EventBus.emit("extra-life", this.extraLivesEarned);
    }

    EventBus.emit("score-updated", this.score);
  }
}
