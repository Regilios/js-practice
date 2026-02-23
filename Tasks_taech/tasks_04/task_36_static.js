/* Что делает static

static объявляет статическое поле или метод класса — то есть такое, которое принадлежит самому классу (конструктору), а не его экземплярам.
Экземплярный метод: доступен как obj.method()
Статический метод: доступен как ClassName.method()
*/
class User {
  static role = "USER"; // статическое поле
  static fromJson(json) {
    // статический метод
    const data = JSON.parse(json);
    return new User(data.name);
  }

  constructor(name) {
    this.name = name;
  }
}

User.role; // "USER"
User.fromJson('{"name":"Ann"}'); // User instance

const u = new User("Bob");
u.role; // undefined
u.fromJson; // undefined
/*
Какая польза
1) “Функции при классе” (утилиты и фабрики)
Если функция логически относится к типу, но ей не нужен конкретный объект, делайте её static.
парсинг / валидация
создание экземпляров (“фабрики”)
преобразования данных
*/
class Money {
  constructor(cents) {
    this.cents = cents;
  }

  static fromEuro(amount) {
    return new Money(Math.round(amount * 100));
  }
}

const m = Money.fromEuro(12.34);
/*
2) Общие константы/настройки класса
Константы, перечисления, дефолтные значения, которые одинаковы для всех экземпляров.
*/
class HttpClient {
  static DEFAULT_TIMEOUT_MS = 10_000;
}
/*
3) Кэш/счётчики/реестр общие для всех экземпляров
Когда данные должны быть общими для всех объектов данного класса.
*/
class Connection {
  static active = 0;

  constructor() {
    Connection.active++;
  }
  close() {
    Connection.active--;
  }
}
/*
4) Полиморфизм на уровне класса
Статические методы поддерживают наследование, и внутри них можно использовать this как “текущий класс”.
*/
class Base {
  static create() {
    return new this();
  }
}
class Child extends Base {}

Base.create() instanceof Base; // true
Child.create() instanceof Child; // true
Math.max;
/*
Когда применять (правило выбора)

Используйте static, если верно хотя бы одно:
Методу не нужны данные конкретного экземпляра (this экземпляра)
Это операция над “типом”, а не над объектом (parse, validate, compare, create)
Нужно хранить общее состояние/константы на уровне класса
Хотите API вида ClassName.doSomething() (как в Math.max, Object.keys)

Когда НЕ применять

Если метод использует состояние экземпляра (this.name, this.items, и т.п.) — это не static.
Если вы хотите “сэкономить память”: в JS обычные методы класса и так лежат в prototype, и не копируются на каждый объект. static не про оптимизацию памяти, а про модель ответственности.
Связь с привычными примерами из JS
Многие встроенные “классы” используют static-подобный стиль:
Math.max() — чистая утилита, нет экземпляров Math
Object.keys(obj) — операция на уровне типа Object
Array.isArray(x) — проверка типа, не метод конкретного массива

Короткие рекомендации по стилю

static хорошо подходит для фабрик: User.from(dto), DateRange.parse(str)
Для констант — static SOME_CONST = ... (или Object.freeze на объекте-константе)
Для “синглтонов” и глобального состояния лучше аккуратно: статическое состояние усложняет тестирование, если его много

*/
