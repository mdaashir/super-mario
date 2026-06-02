import { InputManager } from "../input/InputManager";
import { Player } from "../entities/Player";

export class MovementSystem {
  private player: Player;
  private input: InputManager;

  constructor(player: Player, input: InputManager) {
    this.player = player;
    this.input = input;
  }

  update(): void {
    this.player.handleInput({
      left: this.input.isDown("moveLeft"),
      right: this.input.isDown("moveRight"),
      run: this.input.isDown("run"),
      jump: this.input.justDown("jump"),
    });
  }
}
