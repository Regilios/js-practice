/**
 * мы внутри функции ?
 *       ↓   
 *       └──> нет ----------------------> внутри модуля? 
 *       |                                      ↓
 *       |                                      └──> нет -> this = gloabal object (в зависимости от среды Host где выполняется код может установить this по умолчанию чем считает нужным. Node вернёт {}, браузер Window, V8 [gloabal object])
 *       |                                      ↓ 
 *       └──> да                                └──> да -> this = undefinded
 *             ↓
 *             #    
 */
{
    "use strict"
    console.log("this is", this); //  gloabal object (v8)  window (браузер) 
}

/**
 *      # 
 *      ↓
 * я в функции
 *       ↓          
 *       └──> Это normal function? (Нормальная фун. это любая фун или метод которая не является стрелочной(ым))
 *                    ↓   
 *                    └──> нет -> мы в стрелочной -> перейти к род. окружению по цепочке окружений (doArrowThing не нормальная ->doLogThis нормальная)
 *                    ↓                              ищем this - в строгом режиме будет undefinded в не строгом Зависит от среды  
 *                    да 
 *                    ↓
 *                    #  
 */
{
    "use strict"

    function doLogThis() {
        var doArrowThing = (
            () => console.log("this is", this)
            /*  💡 Стрелочные функции НЕ имеют собственного this.
                   Они захватывают this из окружающей области видимости (лексического контекста) в момент своего создания,
                   и никогда не меняют его, независимо от того, как и где их вызывают. 
            */
        );
        doArrowThing();
    }
    doLogThis();
}
/**
 *      # 
 *      ↓
 *      вызов нормальной функции this = undefinded если this не переопределён
 *      видим ВЫЗОВ в dot нотации (theObj.doLogThis() theObj.[doLogThis]()) -> нет -> this = undefinded 
 *      ↓
 *      # 
 */
{
    "use strict"

    function doLogThis() {
        console.log("this is", this)
    }
    doLogThis();
}

/**
 *      # 
 *      ↓
 *      видим call apply bind -> this = значению метода  doLogThis.call(thisArg);
 *      ↓
 *      # 
 */
{
    "use strict"

    function doLogThis() {
        console.log("this is", this)
    }
    var thisArg = { name: "thisArg", n: "111" }
    doLogThis.call(thisArg);
    doLogThis.apply(thisArg);
    doLogThis.bind(thisArg)();
}

/**
 *      # 
 *      ↓
 *      видим new -> this = связывается с пустым объектом {};
 *      ↓
 *      # 
 */
{
    "use strict"

    function doLogThis() {
        console.log("this is", this) // "this is doLogThis {}"
    }
    new doLogThis(); // doLogThis {}
    new doLogThis; // doLogThis {}
}
/**
 *      # 
 *      ↓
 *      видим ВЫЗОВ в dot нотации (theObj.doLogThis() theObj.[doLogThis]()) -> да -> this = идентификатору перед точкой -> theObj ;
 *      ↓
 *      # 
 */
{
    "use strict"

    function doLogThis() {
        console.log("this is", this)
    }
    const theObj = {
        name: '1111'
    }
    theObj.doLogThis = doLogThis; // добавляем к объекту метод
    theObj.doLogThis();
}
/**
 * пример наоборот
 */
{
    "use strict"
    const theObj = {
        name: '1111',
        doLogThis: function() {
            console.log("this is", this)
        }
    }
    theObj.doLogThis(); // this is {name: '1111', doLogThis: ƒ}

    var doLogThisGlobal = theObj.doLogThis; //Ссылаемся на функцию - При вызове doLogThisGlobal() контекст this теряется (в strict mode будет undefined).
    doLogThisGlobal(); // вызывается doLogThis undefinded
}

/**
 * пример наоборот 2
 */
{
    "use strict"
    const theObj = {
        name: '1111',
        doLogThis: function() {
            console.log("this is", this)
        }
    }
    setTimeout(theObj.doLogThis, 1); // дот нотация но НЕ ВЫЗОВ, Здесь theObj.doLogThis передаётся как колбэк,
    // и когда событие срабатывает, функция вызывается не в контексте объекта theObj, а в контексте элемента DOM (document).

}

/**
 * пример наоборот 3
 */
{
    "use strict"
    const theObj = {
        name: '1111',
        doLogThis: function() {
            console.log("this is", this)
        }
    }

    var doLogThis = theObj.doLogThis;
    setTimeout(() => theObj.doLogThis(), 1); // Выведет: this is {name: '1111', doLogThis: ƒ}
    setTimeout(doLogThis, 1); // this is пустая строка - т.к. это ссылка на функцию хоть и в дот нотации но не её вызов. 
    // Сет тайм вызовёт просто doLogThis() в контексте DOM и вернёт Window или global obj(в node), а у Window есть свойство name которое пусто.

    // важно не как на функцию сослались а как она вызывана  / для js то же самое что пример 2
    // но если вызвать этот код в node то this вернёт Объект Timeout -> см Api js
}


/**
 *  💡 JS встроенный ЯП и у него есть свой набор api который позволяет вызывать свои функции
 *  API вызов может нарушить всю логику
 *  Когда ты передаёшь функцию как обработчик события через addEventListener,
 *  браузер вызывает её как метод целевого элемента (в данном случае — document.body), но с определёнными правилами.
 * 
 * // Упрощённо, внутри движка:
 * listener.call(event.currentTarget, event);
 * event.currentTarget — это элемент, к которому прикреплён обработчик (в твоём случае — document.body),
 * listener — это твоя функция doLogThis.
 * То есть, браузер использует .call() или аналог, чтобы вызвать функцию, передавая event.currentTarget как this.
 * Поэтому this внутри doLogThis будет равно document.body, даже в strict mode.
 */
{
    (() => {
        "use strict"

        function doLogThis() {
            console.log("this is", this)
        }
        document.body.addEventListener("click", doLogThis);
        document.body.addEventListener("click", doLogThis.bind({ "yo": "yo" }));
    })();
}


/*
    В non strict режиме this проходит через toObject (преобразуется к объекту через конструтктор)
*/
{
    String.prototype.doThingStrict = function() {
        "use strict";
        console.log("this is", this instanceof Object, this)
    }
    String.prototype.doThing = function() {
        console.log("this is", this instanceof Object, this)
    }
    Number.prototype.doThing = function() {
        console.log("this is", this instanceof Object, this)
    }
    "yo".doThingStrict(); // this is false yo
    "yo".doThing(); // this is true String {'yo'}
    1..doThing(); // this is true Number {1}
}

/**
 *  theObj.returnFunction — это ссылка на функцию, но не вызов.
    Эта ссылка передаётся в doSayName как аргумент.
    Внутри doSayName происходит: doThing(); // ← это вызов: returnFunction()
    Но теперь returnFunction вызывается без контекста — просто как doThing(), а не как obj.returnFunction().
    Поскольку "use strict" включён: this внутри returnFunction → undefined
    Теперь создаётся стрелочная функция () => console.log("this is", this)
    Она захватывает this из окружающей области — а это undefined!

    ❓  "Если this в стрелочной функции определяется лексически в момент создания, почему она не запомнила контекст theObj — ведь она была создана там?
        А если мы передали ссылку и вызвали позже, разве она не должна сохранить своё окружение?" 

        Да, ты прав — она действительно запоминает окружение из theObj... но только если была создана в theObj.
        Проблема в том, когда и в каком контексте создаётся стрелочная функция.
        theSuperObj.doSayName(theObj.returnFunction); Передаётся ссылка на функцию returnFunction, но не вызов
    
    💡 Стрелочная функция создаётся не тогда, когда ты объявляешь returnFunction, а тогда, когда returnFunction выполняется.
       Она должна запомнить окружение из theObj — но только если была создана в theObj.
       А в случае theObj.returnFunction (без ()), создание стрелочной функции происходит не в theObj, а внутри doSayName, где this — undefined
    
    theSuperObj вызывает returnFunction, но не создаёт стрелочную функцию сам
    Стрелочная функция создаётся внутри returnFunction
    А returnFunction в этом случае выполняется без контекста, значит this = undefined

    returnFunction вызывается внутри theSuperObj.doSayName, но НЕ как метод theSuperObj.
    this внутри returnFunction будет undefined (в strict mode) — не потому что она в глобальной области, а потому что у неё нет владельца при вызове. 
    То есть, с точки зрения стека вызовов — да, returnFunction вызывается внутри метода theSuperObj.
    Но это не значит, что this внутри returnFunction — theSuperObj.
 */

{
    "use strict"
    const theObj = {
        name: '1111',
        returnFunction: function() {
            var doArrowThing = (
                () => console.log("this is", this)
            );
            return doArrowThing;
        }
    }
    const theSuperObj = {
        name: '2222',
        doSayName: function(doThing) {
            doThing(); //💡 ← вызов функции как free function Это не метод theSuperObj, даже если вызывается внутри theSuperObj.
        }
    }
    theSuperObj.doSayName(theObj.returnFunction); // this is undefinded
    theSuperObj.doSayName(theObj.returnFunction()); // this is {name: '1111', returnFunction: ƒ}
}