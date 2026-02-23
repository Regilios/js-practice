"use strict";

function inc(a) {
  return ++a;
}

const sum = function (a, b) {
  return a + b;
};

const max = (a, b) => (a > b ? a : b);

console.log("Names: ");
console.dir({
  inc: inc.name,
  sum: sum.name,
  max: max.name,
});

console.log("Arguments: ");
console.dir({
  inc: inc.length,
  sum: sum.length,
  max: max.length,
});

console.log(
  "Anonymous function: " +
    function (x) {
      return x;
    }.name,
);
console.log("Anonymous lambda: " + ((x) => x).name);

console.log("toString: ");
console.dir({
  inc: inc.toString(),
  sum: sum.toString(),
  max: max.toString(),
});
/**
 * Names: 
    {inc: 'inc', sum: 'sum', max: 'max'}
    Arguments: 
    {inc: 1, sum: 2, max: 2}
    Anonymous function: 
    Anonymous lambda: 
    toString: 
    {inc: 'function inc(a) {
    return ++a;
    }', sum: 'function (a, b) {
    return a + b;
    }', max: '(a, b) => (a > b ? a : b)'}
 */
