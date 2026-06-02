export interface KeyBindings {
  moveLeft: string;
  moveRight: string;
  jump: string;
  run: string;
  pause: string;
  fire: string;
}

export const DEFAULT_KEY_BINDINGS: KeyBindings = {
  moveLeft: "ArrowLeft",
  moveRight: "ArrowRight",
  jump: "ArrowUp",
  run: "Shift",
  pause: "Escape",
  fire: "KeyZ",
};
