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