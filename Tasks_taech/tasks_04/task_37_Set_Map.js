/*1) Что такое Set и Map
Set

Коллекция уникальных значений (без повторов). Удобен для:
дедупликации данных,
быстрых проверок “есть ли значение”,
операций над множествами (union/intersection/difference),
хранения ссылок на объекты без повторов.

Map

Коллекция пар ключ → значение. Удобна, когда:
ключи не только строки (в отличие от обычного объекта),
нужен предсказуемый порядок обхода,
часто добавляете/удаляете ключи,
требуется размер (size) и итерации по ключам/значениям.

2) Ключевая семантика: как сравниваются значения
И Set, и Map используют сравнение SameValueZero:
похоже на ===,но NaN считается равным NaN,
+0 и -0 считаются одинаковыми.

Примеры:
*/
{
    const s = new Set([NaN, NaN, 1, 1]);
    console.log(s.size); // 2 (NaN и 1)

    const m = new Map();
    m.set(NaN, "x");
    console.log(m.get(NaN)); // "x"

    m.set(-0, "minus");
    console.log(m.get(0)); // "minus"
}
/*
Важная деталь про объекты как ключи/элементы

Для объектов сравнение — по ссылке, не по структуре:
*/
{
    const a = { x: 1 };
    const b = { x: 1 };

    const s = new Set([a, b]);
    console.log(s.size); // 2 (разные ссылки)

    const m = new Map();
    m.set(a, "A");
    console.log(m.get({ x: 1 })); // undefined (другая ссылка)
}

/*
3) API: основные операции
Set
Создание*/
const s1 = new Set();
const s2 = new Set([1, 2, 2, 3]); // {1,2,3}
/*
Методы и свойства
*/
add(value) //→ добавляет, возвращает сам set (чейнится)
has(value) //→ boolean
delete(value) //→ boolean (удалилось или нет)
clear() //→ очищает
size// → количество элементов
{
    const s = new Set();
    s.add(1).add(2);
    console.log(s.has(2)); // true
    s.delete(2);
    console.log(s.size); // 1
}
/*
Итерация

for...of (значения)
forEach((value, value2, set) => ...) (value2 = value — исторически)
keys(), values() (одно и то же), entries() ([value, value])
*/
{
    for (const v of s) console.log(v);

    s.forEach((v) => console.log(v));

    for (const [v1, v2] of s.entries()) {
    // v1 === v2
    }
}
/*
Map
Создание*/
const m1 = new Map();
const m2 = new Map([
  ["a", 1],
  ["b", 2],
]);

/*
Методы и свойства
*/
set(key, value)// → map (чейнится)
get(key) //→ value | undefined
has(key) //→ boolean
delete(key) //→ boolean
clear() //→ очищает
size //→ количество пар
{
    const m = new Map();
    m.set("a", 1).set("b", 2);
    console.log(m.get("a")); // 1
    console.log(m.has("c")); // false
}
/*
Итерация

for...of даёт [key, value]
forEach((value, key, map) => ...)
keys(), values(), entries()
*/
for (const [k, v] of m) console.log(k, v);

m.forEach((v, k) => console.log(k, v));
/*
4) 
Map vs обычный объект {} — когда что
Объект лучше, когда:

ключи всегда строки/символы, и структура ближе к “записи” (record),
нужно JSON-сериализовать напрямую,
используете удобства литералов, деструктуризацию и т.п.

Map лучше, когда:
ключи могут быть любыми типами (объекты, функции, DOM-узлы),
много добавлений/удалений,
важен точный размер и удобный обход,
избегаете проблем с прототипом и “особенными” ключами.
Подводный камень объекта:*/
const obj = {};
obj["__proto__"] = 123; // может вести себя неожиданно


//Если нужен “чистый словарь” на объектах — используйте Object.create(null):

const dict = Object.create(null);
dict["__proto__"] = 123; // теперь это обычный ключ
/*
5) Типовые паттерны (то, что реально часто нужно)
5.1 Дедупликация массива через Set*/
const arr = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(arr)];
// [1,2,3]
/*
5.2 Быстрая проверка membership*/
const allowed = new Set(["GET", "POST"]);
if (allowed.has(method)) { ... }
/*
5.3 Подсчёт частот через Map*/
const freq = new Map();
for (const x of ["a", "b", "a"]) {
  freq.set(x, (freq.get(x) ?? 0) + 1);
}
console.log(freq.get("a")); // 2
/*
5.4 Группировка по ключу*/
{
    const items = [
    { type: "fruit", name: "apple" },
    { type: "fruit", name: "pear" },
    { type: "veg", name: "carrot" },
    ];

    const groups = new Map();
    for (const it of items) {
    const list = groups.get(it.type) ?? [];
    list.push(it);
    groups.set(it.type, list);
    }
}
/*
5.5 “Последний wins” при мерже

Map удобен, если нужно сохранять порядок и обновлять значение:*/

const m = new Map([["a", 1], ["b", 2]]);
m.set("a", 99); // ключ остаётся в своём месте, значение обновится
/*
6) Операции над множествами (Set algebra)
Union*/
const union = (a, b) => new Set([...a, ...b]);

//Intersection
const intersection = (a, b) => new Set([...a].filter(x => b.has(x)));

//Difference (a \ b)
const difference = (a, b) => new Set([...a].filter(x => !b.has(x)));

/*
7) Порядок элементов и “стабильность”
И Set, и Map сохраняют порядок вставки при итерации.
Удаление и повторное добавление ключа/значения обычно перемещает его в конец:
*/

const s = new Set([1, 2, 3]);
s.delete(2);
s.add(2);
console.log([...s]); // [1,3,2]

/*
8) Производительность и сложность
В среднем:

set/add, get/has, delete у Map/Set — амортизированно O(1).
Итерация — O(n).

Практически:
Set/Map почти всегда выигрывают у Array.includes / линейного поиска на больших объёмах.
Для очень маленьких коллекций разница может быть незаметна.

9) Сериализация / JSON и важные ограничения
*
JSON не поддерживает Map/Set напрямую*/
JSON.stringify(new Set([1,2])); // "{}"
JSON.stringify(new Map([["a",1]])); // "{}"

/*
Правильные варианты:
*/
// Set -> Array
const jsonSet = JSON.stringify([...set]);

// Map -> Array of entries
const jsonMap = JSON.stringify([...map.entries()]);
/*
Восстановление:
*/
const set = new Set(JSON.parse(jsonSet));
const map = new Map(JSON.parse(jsonMap));
/*
Map с объектами-ключами нельзя “нормально” сериализовать
Потому что ключи — ссылки, JSON этого не выразит без вашей схемы идентификаторов.
*/
/*
10) Утечки памяти и Weak* коллекции
Если вы используете объекты как ключи/элементы и хотите, чтобы сборщик мусора мог их очищать при исчезновении внешних ссылок:

WeakMap

ключи только объекты
не итерируется
нет size
полезен для метаданных, кэшей, привязки состояния к объекту

WeakSet

элементы только объекты
не итерируется
нет size
Пример “приватного” состояния через WeakMap:
*/

const priv = new WeakMap();

class A {
  constructor(x) {
    priv.set(this, { x });
  }
  getX() {
    return priv.get(this).x;
  }
}
/*
11) Частые ошибки и как их избежать

Ожидание “структурного” сравнения объектов
Решение: ключи делайте примитивами (id), или храните ссылки строго на те же объекты.
Использование Map, когда нужен JSON
Решение: преобразуйте в массив/объект при сохранении.

Проверка get() вместо has()
get() возвращает undefined и при отсутствии ключа, и при значении undefined.
if (m.has(k)) { ... } // корректно


Изменение Map/Set во время обхода
Это возможно, но может приводить к неочевидному порядку. Если логика сложная — делайте снимок:
for (const x of [...set]) { ... }

12) Мини-решалка выбора: что брать
Нужны уникальные значения? → Set
Нужна пара ключ→значение и ключи не только строки? → Map
Нужен “простой JSON-объект” без сложных ключей? → {} или Object.create(null)
Нужны ключи-объекты без утечек? → WeakMap
Нужен набор объектов без утечек? → WeakSet
*/