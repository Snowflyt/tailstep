import type { Bounce, Cont, Done } from "./types";

/**
 * Create a {@link Done} {@link Bounce}.
 * @param value The value to return.
 * @returns
 */
export function done<T>(value: T): Done<T> {
  return { _tag: "done", value };
}
/**
 * Create a {@link Cont} {@link Bounce}.
 * @param thunk The function to continue with.
 * @returns
 */
export function cont<T>(thunk: () => Bounce<T>): Cont<T> {
  return { _tag: "cont", thunk };
}

/**
 * Apply a {@link Bounce} until it is done.
 * @param bounce The {@link Bounce} to apply.
 * @returns
 *
 * @example
 * ```typescript
 * import { done, cont, type Bounce } from "bounce";
 *
 * function fib(n: bigint): bigint {
 *   function loop(a: bigint, b: bigint, n: bigint): Bounce<bigint> {
 *     if (n === 0n) return done(a);
 *     return cont(() => loop(b, a + b, n - 1n));
 *   }
 *   return bounce(loop(0n, 1n, n));
 * }
 *
 * fib(100000n); // => 25974069...
 * ```
 */
export function bounce<T>(bounce: Bounce<T>): T {
  let current = bounce;
  while (current._tag === "cont") current = current.thunk();
  return current.value;
}
