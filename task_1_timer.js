'use strict';

const INTERVAL = 10; 
/** 
 * 
 * INTERVAL выражение вычеслить идентификатор INTERVAL в лекическом окруженеии в RunTime есть ли такие же области
 * в памяти которым было присвоено имя INTERVAL если нет то Environment Record присвоит области памяти это имя
 * после Lexical Environment свяжет эту ячейку с внешним оркужением 
 * 
 * через механизм назначения const INTERVAL идентификатору назначаются свойства связывания -
 * неинициализрована, немутабельна, удаляемость, определить блочную облоасть видиомсти (Declarative Environment Record), запрет повтороного объявления
 * автоматическое поднятие (без инициализации, остаётся в TDZ)
 * 
 * выражение 10 - вычислисть числовой литерал и получить его значение 10
 * выражение = связывание (асаймент), связать 1 и 2 выражения между собой 
 */
const MAX_VALUE = 10;

let counter = 0;
let timer = null;

const events = () => {
    if (counter === MAX_VALUE) {
        console.log('The end');
        clearInterval(timer);
        return;
    }
    console.log(
        {
            counter, 
            date:new Date()
        }
    );
    counter++;
}

console.log("Start");
timer = setInterval(events, INTERVAL);


