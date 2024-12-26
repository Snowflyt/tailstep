import type { Done, StepSignal } from "./types";

/**
 * Create a {@link StepSignal} that can be used with {@linkcode tailRec}.
 * @param args The arguments to continue with.
 * @returns
 */
export function step<Args extends unknown[]>(...args: Args): StepSignal<Args> {
  return { _tag: "stepSignal", args };
}

/**
 * Create a tail-recursive function using trampolining.
 * @param def The definition of the function.
 * @returns
 *
 * @example
 * ```typescript
 * import { done, step, tailRec } from "bounce";
 *
 * const factorial = tailRec((n: bigint, acc: bigint = 1n) => {
 *   if (n === 0n) return done(acc);
 *   return step(n - 1n, acc * n);
 * });
 *
 * factorial(100000n); // => 28242294...
 * ```
 */
export function tailRec<Params extends unknown[], R>(
  def: (...args: Params) => Done<R> | StepSignal<NoInfer<Params>>,
): (...args: Params) => R {
  const fn = (...args: Params) => {
    let result = def(...args);
    while (result._tag === "stepSignal") result = def(...result.args);
    return result.value;
  };
  // Preserve the function name
  return Object.defineProperty(fn, "name", {
    value: def.name,
    writable: false,
    enumerable: false,
    configurable: true,
  });
}
