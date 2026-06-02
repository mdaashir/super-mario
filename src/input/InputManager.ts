import Phaser from "phaser";
import { DEFAULT_KEY_BINDINGS, KeyBindings } from "./KeyBindings";

export class InputManager {
  private keys: Record<string, Phaser.Input.Keyboard.Key> = {};
  private bindings: KeyBindings;

  constructor(scene: Phaser.Scene, bindings?: Partial<KeyBindings>) {
    this.bindings = { ...DEFAULT_KEY_BINDINGS, ...bindings };
    if (!scene.input.keyboard) return;
    for (const action of Object.keys(this.bindings) as (keyof KeyBindings)[]) {
      const keyCode = this.bindings[action];
      const parsed = keyCode.startsWith("Key")
        ? (Phaser.Input.Keyboard.KeyCodes as Record<string, number>)[keyCode.replace("Key", "")]
        : (Phaser.Input.Keyboard.KeyCodes as Record<string, number>)[keyCode];
      if (parsed !== undefined) {
        this.keys[action] = scene.input.keyboard.addKey(parsed);
      }
    }
  }

  isDown(action: keyof KeyBindings): boolean {
    return this.keys[action]?.isDown ?? false;
  }

  justDown(action: keyof KeyBindings): boolean {
    return this.keys[action]?.isDown ?? false;
  }
}
