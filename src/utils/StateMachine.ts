export interface StateTransition<TState extends string, TEvent extends string> {
  from: TState;
  event: TEvent;
  to: TState;
}

export class StateMachine<TState extends string, TEvent extends string> {
  private current: TState;
  private transitions: Map<TState, Map<TEvent, TState>> = new Map();
  private onEnter: Map<TState, () => void> = new Map();
  private onExit: Map<TState, () => void> = new Map();

  constructor(initialState: TState, transitions: StateTransition<TState, TEvent>[]) {
    this.current = initialState;
    for (const t of transitions) {
      if (!this.transitions.has(t.from)) {
        this.transitions.set(t.from, new Map());
      }
      this.transitions.get(t.from)!.set(t.event, t.to);
    }
  }

  get state(): TState {
    return this.current;
  }

  can(event: TEvent): boolean {
    const fromTransitions = this.transitions.get(this.current);
    return fromTransitions?.has(event) ?? false;
  }

  dispatch(event: TEvent): boolean {
    const fromTransitions = this.transitions.get(this.current);
    if (!fromTransitions) return false;
    const next = fromTransitions.get(event);
    if (!next) return false;
    this.onExit.get(this.current)?.();
    this.current = next;
    this.onEnter.get(this.current)?.();
    return true;
  }

  onEnterState(state: TState, fn: () => void): void {
    this.onEnter.set(state, fn);
  }

  onExitState(state: TState, fn: () => void): void {
    this.onExit.set(state, fn);
  }
}
