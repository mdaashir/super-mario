import { describe, it, expect } from "vitest";
import { StateMachine } from "../../../src/utils/StateMachine";

describe("StateMachine", () => {
  it("should start in initial state", () => {
    const sm = new StateMachine<"idle" | "walking", "move">("idle", [
      { from: "idle", event: "move", to: "walking" },
    ]);
    expect(sm.state).toBe("idle");
  });

  it("should transition on valid event", () => {
    const sm = new StateMachine<"idle" | "walking", "move">("idle", [
      { from: "idle", event: "move", to: "walking" },
    ]);
    expect(sm.dispatch("move")).toBe(true);
    expect(sm.state).toBe("walking");
  });

  it("should reject invalid transition", () => {
    const sm = new StateMachine<"idle", "jump">("idle", []);
    expect(sm.dispatch("jump")).toBe(false);
    expect(sm.state).toBe("idle");
  });

  it("should call onEnter callbacks", () => {
    const entered: string[] = [];
    const sm = new StateMachine<"a" | "b", "go">("a", [
      { from: "a", event: "go", to: "b" },
    ]);
    sm.onEnterState("b", () => entered.push("b"));
    sm.dispatch("go");
    expect(entered).toEqual(["b"]);
  });

  it("should call onExit callbacks", () => {
    const exited: string[] = [];
    const sm = new StateMachine<"a" | "b", "go">("a", [
      { from: "a", event: "go", to: "b" },
    ]);
    sm.onExitState("a", () => exited.push("a"));
    sm.dispatch("go");
    expect(exited).toEqual(["a"]);
  });

  it("should report can() correctly", () => {
    const sm = new StateMachine<"a" | "b", "go" | "back">("a", [
      { from: "a", event: "go", to: "b" },
    ]);
    expect(sm.can("go")).toBe(true);
    expect(sm.can("back")).toBe(false);
  });

  it("should chain multiple transitions", () => {
    type S = "a" | "b" | "c";
    type E = "next" | "back";
    const sm = new StateMachine<S, E>("a", [
      { from: "a", event: "next", to: "b" },
      { from: "b", event: "next", to: "c" },
    ]);
    sm.dispatch("next");
    expect(sm.state).toBe("b");
    sm.dispatch("next");
    expect(sm.state).toBe("c");
    expect(sm.dispatch("back")).toBe(false);
  });
});
