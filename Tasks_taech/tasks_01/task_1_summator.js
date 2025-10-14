const adder = (initial = 0) => ({
  value: initial,
  steps: [initial],
  add(value) { // тоже что  add: function(value) { }
    this.value += value;
    this.steps.push(value);
    
    return this;
  }
});

const adder2 = (initial = 0) => ({
  value: initial,
  steps: [initial],
  add(value) { 
    this.value += value; // value → передаём значение пришедшее в add из вне
    this.steps.push(this.value); // this.value → обращаемся к значению внутри adder

    return this;
  }
});



const Adder = class {
  constructor(initial = 0) {
    this.steps = [initial];
    this.value = initial;
  }

  add(value) {
    this.steps.push(value);
    this.value += value;
    return this;
  }
};

// Usage

{
  const { value, steps: steps2 } = adder2(5).add(-8).add(11);
  console.log(steps2); // [5, -3, 8]

  const { value: myValue, steps } = adder(5).add(-8).add(11);
  console.log(steps); // [5, -8, 13]

  /**
   * JS берёт свойство value из объекта adder
   * Сохраняет его значение  в новой переменной с именем myValue
   * Переменная value не создаётся
   * const { value, steps } то же самое что const { value: value, steps: steps } 
   * 
   */
  console.log(typeof(myValue));
  const [a, b, c] = steps;
  console.log(a, b, c);
}
  console.log("-------");
{
  const { a, b } = { a: 1, b: "sssss"};
  /**
   * {a, b} — это не идентификатор , это шаблон , по которому JS извлекает данные из объекта.
   * т.е. тут созданы 2 переменыне const a const b а не объект {a, b}!
   */
  console.log(typeof(a));
  console.log(typeof(b));
  console.log({a,b});
  console.log(a);
  console.log(typeof({a,b}));
}
  console.log("-------");
{
  const obj = { a: 1, b: "sssss" };
  const { a, b } = obj;
  console.log(a);
  console.log(b);
}
  console.log("-------");
{
  const { value, steps } = new Adder(5).add(-8).add(11);
  console.log(value);
  const [a, b, c] = steps;
  console.log(a, b, c);
}