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
 
 */