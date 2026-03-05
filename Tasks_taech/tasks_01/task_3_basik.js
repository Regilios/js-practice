'use strict';

const SALUTATION = "Ave";
const COLORS = [
    'black',
    'red',
    'green',
    'yellow.',
    'blue',
    'magenta',
    'cyan',
    'white'
];

const colors = (s, color) => `\x1b[3${color}m${s}\x1b[0m`;

const colorize = (name) => {
    let result = '';
    const letters = name.split('');
    let color_number = 0;
    for (const letter of letters) {
        result += colors(letter, color_number++);
        if (color_number > COLORS.length) {
            color_number = 0;
        }
    }
    return result;
};

const greetings = (name) => (
  name.includes('Augustus') ? `${SALUTATION}, ${colorize(name)}!` : `Hello, ${name}!`
);

const fullName = 'Marcus Aurelius Antoninus Augustus';
console.log(greetings(fullName));

const shortName = 'Marcus Aurelius';
console.log(greetings(shortName));
