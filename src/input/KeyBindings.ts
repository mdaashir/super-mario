export interface KeyBindings {
  moveLeft: string;
  moveRight: string;
  jump: string;
  run: string;
  pause: string;
  fire: string;
}

export const DEFAULT_KEY_BINDINGS: KeyBindings = {
  moveLeft: "LEFT",
  moveRight: "RIGHT",
  jump: "UP",
  run: "SHIFT",
  pause: "ESC",
  fire: "Z",
};
