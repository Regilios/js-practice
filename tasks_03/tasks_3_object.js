/**
 *  Встроенные объекты.  в JS это, на самом деле, встроенные функции. Каждая из этих встроенных функций может быть использована как конструктор.
 *  String
    Number
    Boolean
    Object
    Function
    Array
    Date
    RegExp
    Error
 */
var strPrimitive = "I am a string";
typeof strPrimitive;	// "string"
strPrimitive instanceof String;	// false

var strObject = new String( "I am a string" );
typeof strObject; // "object"
strObject instanceof String;	// true
// проверим подтип объекта
Object.prototype.toString.call( strObject );	// [object String]



/**Два объекта равны только в том случае, если это один и тот же объект. */

let a = {};
let b = a; // копирование по ссылке

alert( a == b ); // true, обе переменные ссылаются на один и тот же объект
alert( a === b ); // true

{
    let a = {};
    let b = {}; // два независимых объекта

    alert( a == b ); // false
}

/*
ES6 добавляет вычисляемые имена свойств, где можно указать выражение, обрамленное [ ], в качестве пары ключ-значение при литеральном объявлении объекта:
*/
var prefix = "foo";
var myObject = {
    [prefix + "bar"]: "hello",
    [prefix + "baz"]: "world"
};
myObject["foobar"]; // hello
myObject["foobaz"]; // world