import type { tailRec } from "./tailRec";

/**
 * Represents a computation that can be done or continued.
 */
export type Bounce<T> = Done<T> | Cont<T>;
export interface Done<T> {
  _tag: "done";
  value: T;
}
export interface Cont<T> {
  _tag: "cont";
  thunk: () => Bounce<T>;
}

/**
 * A signal to continue the computation that can be used with {@linkcode tailRec}.
 */
export interface StepSignal<Args extends unknown[]> {
  _tag: "stepSignal";
  args: Args;
}
