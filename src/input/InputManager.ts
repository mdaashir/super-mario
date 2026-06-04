import Phaser from "phaser";
import { DEFAULT_KEY_BINDINGS, KeyBindings } from "./KeyBindings";

const GAMEPAD_BUTTON_MAP: Record<string, number> = {
  jump: 0,
  run: 1,
  fire: 2,
  pause: 9,
};

const AXIS_THRESHOLD = 0.5;

export class InputManager {
  private scene: Phaser.Scene;
  private keys: Record<string, Phaser.Input.Keyboard.Key> = {};
  private bindings: KeyBindings;
  private prevButtonState: Record<number, boolean> = {};
  private justPressedButtons: Set<number> = new Set();

  constructor(scene: Phaser.Scene, bindings?: Partial<KeyBindings>) {
    this.scene = scene;
    this.bindings = { ...DEFAULT_KEY_BINDINGS, ...bindings };
    if (!scene.input.keyboard) return;
    for (const action of Object.keys(this.bindings) as (keyof KeyBindings)[]) {
      const keyCode = this.bindings[action];
      this.keys[action] = scene.input.keyboard.addKey(keyCode);
    }
  }

  isDown(action: keyof KeyBindings): boolean {
    if (this.keys[action]?.isDown) return true;
    if (action === "moveLeft") return this.getAxisValue(0) < -AXIS_THRESHOLD || this.isGamepadButtonDown(14);
    if (action === "moveRight") return this.getAxisValue(0) > AXIS_THRESHOLD || this.isGamepadButtonDown(15);
    return false;
  }

  justDown(action: keyof KeyBindings): boolean {
    if (this.keys[action] && Phaser.Input.Keyboard.JustDown(this.keys[action])) return true;
    const btn = GAMEPAD_BUTTON_MAP[action];
    if (btn !== undefined && this.justPressedButtons.has(btn)) return true;
    return false;
  }

  update(): void {
    this.pollGamepad();
  }

  resetKeys(): void {
    for (const key of Object.values(this.keys)) {
      key.reset();
    }
  }

  private getAxisValue(axisIndex: number): number {
    const pad = this.scene.input.gamepad?.pad1;
    if (!pad) return 0;
    try {
      return pad.axes[axisIndex]?.getValue() ?? 0;
    } catch {
      return 0;
    }
  }

  private isGamepadButtonDown(buttonIndex: number): boolean {
    const pad = this.scene.input.gamepad?.pad1;
    if (!pad) return false;
    try {
      return pad.buttons[buttonIndex]?.pressed ?? false;
    } catch {
      return false;
    }
  }

  private pollGamepad(): void {
    this.justPressedButtons.clear();
    const pad = this.scene.input.gamepad?.pad1;
    if (!pad) return;
    for (const [, btnIdx] of Object.entries(GAMEPAD_BUTTON_MAP)) {
      const pressed = this.isGamepadButtonDown(btnIdx);
      const prev = this.prevButtonState[btnIdx] ?? false;
      if (pressed && !prev) {
        this.justPressedButtons.add(btnIdx);
      }
      this.prevButtonState[btnIdx] = pressed;
    }
  }
}
