<h1 align="center">tailstep</h1>

<p align="center">
Simple <strong>trampoline</strong>-based <strong>tail recursion</strong> for modern JavaScript/TypeScript
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/tailstep">
    <img src="https://img.shields.io/npm/v/tailstep.svg" alt="npm version" height="18">
  </a>
  <a href="https://bundlephobia.com/package/tailstep">
    <img src="https://img.shields.io/bundlephobia/minzip/tailstep.svg" alt="minzipped size" height="18">
  </a>
  <a href="https://github.com/Snowflyt/tailstep/actions/workflows/test.yml">
    <img src="https://github.com/Snowflyt/tailstep/actions/workflows/test.yml/badge.svg" alt="test status" height="18">
  </a>
  <a href="https://coveralls.io/github/Snowflyt/tailstep?branch=main">
    <img src="https://coveralls.io/repos/github/Snowflyt/tailstep/badge.svg?branch=main" alt="coverage status" height="18">
  </a>
  <a href="https://github.com/gvergnaud/tailstep">
    <img src="https://img.shields.io/npm/l/tailstep.svg" alt="MIT license" height="18">
  </a>
</p>

![screenshot](./screenshot.svg)

## About

Tail recursion is a technique that enables recursive functions to be optimized into loops, preventing stack overflow in many programming languages. However, JavaScript does not natively support tail call optimization (TCO). This library offers a simple way to implement tail-recursive functions in JavaScript/TypeScript.

## Installation

```shell
npm install tailstep
```

## Usage

Consider how we can implement a factorial function using tail recursion in simple JavaScript:

```javascript
function factorial(n, acc = 1) {
  if (n === 0) return acc;
  return factorial(n - 1, n * acc);
}
```

However, this implementation will cause a stack overflow when `n` is large enough. To prevent this, we can use the `tailRec` function provided by this library:

```javascript
import { done, step, tailRec } from "tailstep";

const factorial = tailRec((n, acc = 1) => {
  if (n === 0) return done(acc);
  return step(n - 1, n * acc);
});
```

Here, `done` is used to return the final result, while `step` signals that the recursion should continue with the given arguments. The `tailRec` function automatically converts the tail-recursive function into a loop.

For TypeScript users, simply add type annotations to the function arguments:

```typescript
import { done, step, tailRec } from "tailstep";

const factorial = tailRec((n: number, acc: number = 1) => {
  //  ^?: (n: number, acc?: number) => number
  if (n === 0) return done(acc);
  return step(n - 1, n * acc);
});
```

For easier debugging, consider using a named function instead of an arrow function. This ensures that the function name will appear in the stack trace:

```typescript
const factorial = tailRec(function factorial(n, acc = 1) {
  if (n === 0) return done(acc);
  return step(n - 1, n * acc);
});
```

The `tailRec` function may not work well with TypeScript when defining functions with generic types. In such cases, you may prefer to use the traditional trampoline approach:

```typescript
import { done, cont, bounce, type Bounce } from "tailstep";

function factorial(n: number): number {
  function loop(acc: number, n: number): Bounce<number> {
    if (n === 0) return done(acc);
    return cont(() => loop(n * acc, n - 1));
  }
  return bounce(loop(1, n));
}
```

Here’s how these functions are implemented in the library if you’re curious:

```javascript
const done = (value) => ({ _tag: "done", value });
const cont = (thunk) => ({ _tag: "cont", thunk });

function bounce(bounce) {
  let current = bounce;
  while (current._tag === "cont") current = current.thunk();
  return current.value;
}

const step = (...args) => ({ _tag: "stepSignal", args });

function tailRec(f) {
  const fn = (...args) => {
    let current = f(...args);
    while (current._tag === "stepSignal") current = f(...current.args);
    return current.value;
  };
  return Object.defineProperty(fn, "name", { value: f.name });
}
```
