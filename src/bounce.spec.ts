import { describe, expect, it } from "vitest";

import { bounce, cont, done } from ".";

import type { Bounce } from ".";

function fibRec(n: bigint): bigint {
  function loop(a: bigint, b: bigint, n: bigint): bigint {
    if (n === 0n) return a;
    return loop(b, a + b, n - 1n);
  }
  return loop(0n, 1n, n);
}
function fib(n: bigint): bigint {
  function loop(a: bigint, b: bigint, n: bigint): Bounce<bigint> {
    if (n === 0n) return done(a);
    return cont(() => loop(b, a + b, n - 1n));
  }
  return bounce(loop(0n, 1n, n));
}

describe("bounce", () => {
  it("should not throw a stack overflow error", () => {
    expect(() => fibRec(100000n)).toThrow();
    let result!: bigint;
    expect(() => (result = fib(100000n))).not.toThrow();
    expect(result.toString().length).toBeGreaterThan(10000);
    expect(result.toString().startsWith("25974069")).toBe(true);
  });
});
