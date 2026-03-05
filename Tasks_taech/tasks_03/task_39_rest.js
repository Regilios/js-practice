"use strict";

const f1 = (...args) => {
  console.log(args);
};

f1(1, 2, 3);
/* рест оператор создаёт массив поэтмоу можем итерировать его */
const f2 = (...args) => {
  args.forEach((arg) => {
    const type = typeof arg;
    console.log("Type: " + type);
    if (type === "object") {
      console.log("Value: " + JSON.stringify(arg));
    } else {
      console.log("Value: " + arg);
    }
  });
};

f2(1, "Marcus", { field: "value" });
/**
 * (3) [1, 2, 3]
    Type: number
    Value: 1
    Type: string
    Value: Marcus
    Type: object
    Value: {"field":"value"}
 */
