"use strict";

const sum = new Function("a, b", "return a + b");
/* "a, b" - аргументы функции, "return a + b" - тело */
console.dir({
  name: sum.name,
  length: sum.length,
  toString: sum.toString(),
});
