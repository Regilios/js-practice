/**
 * 🔸 Обычные функции (function) → this зависит от того, кто вызвал
   🔸 Стрелочные функции (=>) → this зависит от того, где создали, контекст сохраняется только для стрелочной функции
 */

function defer(f, ms) {
    return function() {
        setTimeout(() => f.apply(this, arguments), ms)
    };
}

function sayHi(who) {
    console.log('Hello, ' + who);
}

let sayHiDeferred = defer(sayHi, 2000);
sayHiDeferred("John"); // выводит "Hello, John" через 2 секунды
/**
 * Пошагово:
  Шаг 1. Вызов defer(sayHi, 2000)
  Она создаёт и возвращает новую функцию (обёртку):
  function() {
    setTimeout(() => f.apply(this, arguments), ms);
  }
  
  Внутри этой обёртки f замкнута (в нашем случае sayHi), а ms = 2000.
 
  Результат:
  sayHiDeferred теперь хранит эту новую функцию.
  Её можно записать мысленно как:
  sayHiDeferred = function() {
    setTimeout(() => sayHi.apply(this, arguments), 2000);
  };

  Шаг 2. Вызов sayHiDeferred("John")
  Происходит вызов той функции, которую вернул defer.

  Что внутри неё?
  setTimeout(() => sayHi.apply(this, arguments), 2000);
  - this в этой точке — зависит от того, как мы вызвали функцию.
    Мы вызвали её просто sayHiDeferred("John"), не как метод объекта,значит this = undefined (в строгом режиме) или window (в нестрогом).
  - arguments — это объект, который автоматически создаётся при вызове любой обычной функции.
    Он содержит все переданные аргументы:
    arguments = ["John"] (на самом деле это не массив, но ведёт себя похоже). имеет только свойство lenght
    Эти this и arguments замыкаются внутри стрелочной функции, которая передаётся в setTimeout.

  Шаг 3. Вызов setTimeout
  setTimeout — встроенная функция браузера (вызов к Web API).
  Она не вызывает функцию немедленно, а ставит задачу в очередь — через 2000 мс выполнить стрелочную функцию.
  Важно: setTimeout не меняет this для переданной функции.
  Контекст (this) при вызове стрелочной функции определяется по месту, где она создана, а не по тому, кто её вызовет.

  Шаг 4.
  Стрелка: Через 2 секунды стрелочная функция выполняется () => sayHi.apply(this, arguments)
  — берёт this и arguments из внешней функции, т.е. из вызова sayHiDeferred("John").
  Теперь выполняется: sayHi.apply(undefined, ["John"]);

  Шаг 5. Что делает .apply
  Метод Function.prototype.apply: func.apply(thisArg, argsArray) — вызывает func, передавая:
  - thisArg — контекст, который попадёт в this внутри func
  - argsArray — список аргументов
  sayHi.apply(undefined, ["John"]); - Вызови функцию sayHi с контекстом undefined и аргументом "John".


  Почему this не стал setTimeout

  Ты подумал логично — ведь стрелочная функция передаётся в setTimeout, и можно было ожидать, что контекст поменяется.

  Но стрелочные функции не создают собственного this вообще —
  они просто берут this из лексического окружения, где они были созданы.
  Поэтому this не стал «объектом setTimeout» — у setTimeout вообще нет такого механизма.

  Если бы вместо стрелки мы написали обычную функцию:
 */
{
    let user = {
        name: "John",
        show: function() {
            let arrow = () => console.log(this.name);
            arrow();
        }
    };

    user.show(); // "John"
}
/**
 * Разбор:
  Обычная функция show создаёт собственный this (=user при вызове user.show()).
  Внутри неё мы создаём стрелку arrow.

  Стрелка берёт this не из вызова, а из места, где она создана, то есть из функции show, у которой this = user.
  Поэтому arrow() печатает "John", даже если её вызвать просто, без контекста.

  Стрелочные функции:

  Не имеют this.
  Не имеют arguments.
  Не могут быть вызваны с new.
  У них также нет super

  Существует тонкая разница между стрелочной функцией => и обычной функцией, вызванной с .bind(this):

  .bind(this) создаёт «связанную версию» функции.
  Стрелка => ничего не привязывает. У функции просто нет this. При получении значения this – оно, как обычная переменная, берётся из внешнего лексического окружения.
 */

{
    let user = {
        name: "Alice",
        showLater: function() {
            setTimeout(function() {
                console.log("Обычная:", this.name);
            }, 1000);
        }
    };

    user.showLater();
}
/**
 * Через секунду в консоли: Обычная: undefined
 * Почему:

  setTimeout(function() {
    console.log(this.name);
  }, 1000);
  setTimeout вызывает переданную ему функцию без контекста, просто как callback().

  Поэтому внутри этой функции this не указывает на user, а становится undefined (в строгом режиме) или window (в нестрогом).
  Поэтому у этой функции свой собственный this, и он не "всплывает" вверх, даже если она была написана внутри showLater.
  this.name → undefined. 

 */
{
    let user = {
        name: "Alice",
        showLater: function() {
            setTimeout(() => {
                console.log("Стрелочная:", this.name);
            }, 1000);
        }
    };

    user.showLater();
}
/**
 * Почему:
  через секунду Стрелочная: Alice
  Стрелочная функция не создаёт свой this.
  Она берёт this из внешнего контекста, т.е. из функции showLater.

  Когда мы вызываем user.showLater(), внутри неё this = user.

  Стрелка «замыкает» это значение this и использует его,
  даже когда вызывается setTimeout позже и без контекста.
 */

{
    let user = {
        name: "Alice",
        showLater: () => {
            console.log("Обычная:", this.name);
        }
    };

    user.showLater();
} {
    const Context = function() {
        this.name = 'Marcus';
        const city = {
            name: 'Kiev',
            year: 482,
            f1: function() {
                return this.name;
            },
            f2: () => {
                return this.name;
            },
            f3() {
                return this.name;
            }
        };
        return city;
    };

    const city = new Context();

    console.log('city.f1() = ' + city.f1());
    console.log('city.f2() = ' + city.f2());
    console.log('city.f3() = ' + city.f3());
}
/**
 * 
 * стрелка вообще не может взять this от объекта, потому что объект не создаёт собственного лексического окружения.
 * Стрелочная функция создаётся не внутри метода, а просто при создании объекта — на верхнем уровне,то есть в глобальном лексическом контексте,где this = undefined (в strict) или window (в нестрогом).
 * эквивалентно
 *  let showLaterFn = () => console.log(this.name); // здесь this = undefined
    let user = {
      name: "Alice",
      showLater: showLaterFn
    };
 */


{
    function makeFunctions() {
        console.log("Внутри makeFunctions, this =", this);

        return {
            arrow: () => console.log("arrow this =", this),
            regular: function() { console.log("regular this =", this) }
        };
    }

    // Вызов №1
    let obj1 = makeFunctions.call({ name: "Obj1" });

    // Вызов №2
    obj1.arrow(); // ?
    obj1.regular(); // ?
}
/* 
  В момент makeFunctions.call({ name: "Obj1" })

  Мы явно задали this = { name: "Obj1" }

  В консоль:Внутри makeFunctions, this = { name: "Obj1" }
  Внутри makeFunctions создаются две функции:
  arrow:   () => console.log("arrow this =", this),
  regular: function() { console.log("regular this =", this) }

  Что важно:

  Стрелка запоминает this из места, где она была создана,
  то есть из makeFunctions.
  → для неё this = { name: "Obj1" }

  Обычная функция не запоминает this,  оно будет определено только при вызове.

  obj1.arrow() → стрелка не имеет своего this,
  она использует то, что замкнула при создании ({ name: "Obj1" }).
  Вывод: regular this = { arrow: f, regular: f }
*/