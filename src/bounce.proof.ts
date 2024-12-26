import { equal, error, expect, test } from "typroof";

import { bounce, cont, done } from "./bounce";

import type { Bounce } from "./types";

test("bounce", () => {
  function fib(a: bigint, b: bigint, n: bigint): Bounce<bigint> {
    if (n === 0n) {
      expect(done(a)).not.to(error);
      return done(a);
    }
    expect(cont(() => fib(b, a + b, n - 1n))).not.to(error);
    expect(1 + 1).not.to(error);
    return cont(() => fib(b, a + b, n - 1n));
  }

  expect(bounce(fib(0n, 1n, 100000n))).not.to(error);
  expect(bounce(fib(0n, 1n, 100000n))).to(equal<bigint>);
});
