import { equal, error, expect, test } from "typroof";

import { done } from "./bounce";
import { step, tailRec } from "./tailRec";

test("tailRec", () => {
  const factorial = tailRec((n: bigint, acc: bigint = 1n) => {
    if (n === 0n) {
      expect(done(acc)).not.to(error);
      return done(acc);
    }
    expect(step(n - 1n, acc * n)).not.to(error);
    return step(n - 1n, acc * n);
  });

  expect(factorial(100000n)).not.to(error);
  expect(factorial(100000n)).to(equal<bigint>);
});
