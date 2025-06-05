const adder = (initial = 0) => ({
  value: initial,
  steps: [initial],
  add(value) { // тоже что  add: function(value) { }
    this.steps.push(value);
    this.value += value;
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
  const { value: myValue, steps } = adder(5).add(-8).add(11);
  console.log(myValue); 
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
   * т.е. ту созданые 2 переменыне const a const b а не объект {a, b}!
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