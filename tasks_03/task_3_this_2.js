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
    console.log("this is" , this); //  gloabal object (v8)  window (браузер) 
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
            () => console.log("this is" , this)
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
      console.log("this is" , this)
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
      console.log("this is" , this)
    }
    var thisArg = {name: "thisArg", n: "111"}
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
      console.log("this is" , this) // "this is doLogThis {}"
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
      console.log("this is" , this)
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
            console.log("this is" , this)
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
            console.log("this is" , this)
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
            console.log("this is" , this)
        }
    }

    var doLogThis = theObj.doLogThis; 
    setTimeout(doLogThis, 1); // важно не как на функцию сослались а как она вызывана  / для js то же самое что пример 2
    // но если вызвать этот код в node то this вернёт Объект Timeout -> см Api js
}

/**
 * JS встроенный ЯП и у него есть свой набор api который позволяет вызывать свои функции
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
    (()=>{
        "use strict"
        function doLogThis() {
        console.log("this is" , this)
        }
        document.body.addEventListener("click", doLogThis);
        document.body.addEventListener("click", doLogThis.bind({"yo": "yo"}));
    })();
}