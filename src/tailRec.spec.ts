import { describe, expect, it } from "vitest";

import { done, step, tailRec } from ".";

const factorialRec = (n: bigint, acc: bigint = 1n): bigint => {
  if (n === 0n) return acc;
  return factorialRec(n - 1n, acc * n);
};
const factorial = tailRec(function factorial(n: bigint, acc: bigint = 1n) {
  if (n === 0n) return done(acc);
  return step(n - 1n, acc * n);
});

describe("tailRec", () => {
  it("should not throw a stack overflow error", () => {
    expect(() => factorialRec(100000n)).toThrow();
    let result!: bigint;
    expect(() => (result = factorial(100000n))).not.toThrow();
    expect(result.toString().length).toBeGreaterThan(10000);
    expect(result.toString().startsWith("28242294")).toBe(true);
  });

  it("should preserve function name", () => {
    expect(factorial.name.startsWith("factorial")).toBe(true);
  });
});
