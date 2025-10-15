function defer(f, ms) {
  return function() {
    setTimeout(() => f.apply(this, arguments), ms)
  };
}

function sayHi(who) {
  alert('Hello, ' + who);
}

let sayHiDeferred = defer(sayHi, 2000);
sayHiDeferred("John"); // выводит "Hello, John" через 2 секунды

/**
    Стрелочные функции:

    Не имеют this.
    Не имеют arguments.
    Не могут быть вызваны с new.
    У них также нет super

    Существует тонкая разница между стрелочной функцией => и обычной функцией, вызванной с .bind(this):

    .bind(this) создаёт «связанную версию» функции.
    Стрелка => ничего не привязывает. У функции просто нет this. При получении значения this – оно, как обычная переменная, берётся из внешнего лексического окружения.
 */