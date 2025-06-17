'use strict';

// undefined
let emptyScalar;
console.log({ emptyScalar }, typeof emptyScalar); //  'undefined'

// null
const emptyObject = null;
console.log({ emptyObject }, typeof emptyObject); //  'object' 
/**
 * typeof null === 'object'
 * Это известный баг языка, сохранённый ради обратной совместимости.
 * https://tc39.es/ecma262/?spm=a2ty_o01.29997173.0.0.5ab55171tW4N22#sec-typeof-operator
 */

// NaN
let count = NaN; //  (Not-a-Number)
console.log({ count }, typeof count); // 'number' Это числовой тип, но обозначает нечисловое значение в числовом контексте
/**
 * Почему typeof NaN === 'number'? 
 * Потому что NaN — это часть типа number. Это специальное значение , определённое стандартом IEEE 754.
 * https://tc39.es/ecma262/?spm=a2ty_o01.29997173.0.0.5ab55171tW4N22#sec-ecmascript-language-types-number-type
*/

count = undefined + 1;
console.dir({ count });
/**
 *  Выполняется выражение: undefined + 1
 *  При операции сложения JS пытается привести undefined к числу
 *  Number(undefined) → NaN
 *  NaN + 1 → NaN
 *  undefined нельзя привести к числу
 *  Любая операция с NaN возвращает NaN

 */

console.log(Infinity, -Infinity, typeof Infinity); // Infinity и -Infinity — это специальные значения типа number

const s = (
  emptyObject === null ?
    'emptyObject is null' :
    'emptyObject is not null'
);
console.log(s);