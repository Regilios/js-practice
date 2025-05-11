'use strict';

const INTERVAL = 10;
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


