/** перед хапуско ctrl-d чтобы сбросить временные перменные */
/**
 * если сначала объявить const { value, steps } = adder2(5).add(-8).add(11); console.log(steps);
 * а после поменять const { value } то console.log(steps); всё равно выведется даже в строгом режиме, хотя должна быть ошибка refrence error, т.к. создаётся временная переменная
 */
"use strict"
const adder2 = (initial = 0) => ({
    value: initial,
    steps: [initial],
    add(value) {
        this.value += value;
        this.steps.push(this.value);

        return this;
    }
});

const { value } = adder2(5).add(-8).add(11);
console.log(steps);