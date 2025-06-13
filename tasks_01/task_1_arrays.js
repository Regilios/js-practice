'use strict';

const welcome = person => {
    console.log(`Hello: ${person.name}`);
};   

const persons = {
    markus: {name: "Markus"},
    iva: {name: "Iva"},
    oleg: {name: "Oleg"},
};

for (const name in persons) {
    const person = persons[name]
    welcome(person);
}

/**
    Что происходит :
    Создается стрелочная функция welcome, которая принимает один параметр person.
    Функция выводит в консоль строку, содержащую значение поля name объекта person.

    Переменная welcome :
    welcome — это константа (const), которая ссылается на функциональное выражение (стрелочную функцию).
    Согласно спецификации ECMA-262, стрелочные функции создаются через ArrowFunction и имеют лексическое связывание this.
    Это означает, что они не создают собственный контекст (this), а используют контекст из окружающей области видимости.

    Объект persons :
    persons — это константа, которая ссылается на объект.
    Объект создается через литерал объекта ({}), и его свойства добавляются с помощью инициализаторов.
  
    Свойства объекта :
    Имена свойств (markus, iva, oleg) являются строками (ключами объекта).
    Значениями свойств являются объекты, содержащие поле name.
   
    Согласно спецификации :
    При создании объекта через литерал, каждый ключ и значение добавляются в объект через внутреннюю операцию [[DefineOwnProperty]].
    Например, для свойства markus:
    Ключ "markus" добавляется в объект.
    Значение { name: "Markus" } связывается с этим ключом.
 
    Цикл for...in :
    Согласно спецификации ECMA-262:
    for...in создает список всех перечислимых свойств объекта.
    Перечислимые свойства — это те, у которых атрибут [[Enumerable]] установлен в true.
    В данном случае объект persons имеет три перечислимых свойства: markus, iva и oleg.
  
    Переменная name :
    На каждой итерации цикла переменная name получает имя текущего свойства (ключ объекта).
    Тип переменной name — строка (например, "markus", "iva", "oleg").
    
    Чтение значения свойства :
    Значение свойства извлекается с помощью persons[name].
    Согласно спецификации:
    Выполняется операция Get для объекта persons с ключом name.
    Возвращается значение свойства (в данном случае объект, например, { name: "Markus" }).
   
    Переменная person :
    person — это константа, которая ссылается на объект, извлеченный из persons[name].
   
    Тип переменной person — объект.
   
    Вызов функции welcome :
    Функция welcome вызывается с аргументом person.
    Аргумент передается по ссылке, так как person — это объект.
    Внутри функции welcome выполняется доступ к полю name объекта person через person.name.
 */