var theThing = 1;
function doGlobalThing(){
    var local = 7;
    return (
        ()=>{ 
            console.log(local);
            return local; 
        }
    )
}
var returnFunction = doGlobalThing();
function enotherFunction(doThing) {
    var local = 455;
    doThing();
}
enotherFunction(returnFunction);

/**
 *  Creation Phase — Глобальный Execution Context
 * 
 *  Глобальный Execution Context создается первым
 *  LexicalEnvironment - { theThing: <uninitialized>, doGlobalThing: [function], returnFunction: <uninitialized>, notherFunction: [function] }
 * 
 *  GlobalLexicalEnvironment = {
        environmentRecord: {
            theThing: undefined,           // var theThing поднята
            doGlobalThing: [function],     // функция полностью поднята
            returnFunction: <uninitialized>, // let/const/var не встречены
            enotherFunction: [function]    // функция поднята
        },
        outer: null
    };

    Execution Phase — Выполняется строка за строкой
    theThing = 1;

    var returnFunction = doGlobalThing(); 
    
    Вызывается doGlobalThing() → создаётся новый Execution Context
    LexicalEnvironment - { local: <uninitialized> }

    doGlobalThingLexicalEnvironment = {
        environmentRecord: {
            local: undefined,
        },
        outer: GlobalLexicalEnvironment
    }

    Execution Phase — Внутри doGlobalThing() выполняется:
    local = 7;

    doGlobalThingLexicalEnvironment = {
        environmentRecord: {
            local: 7,
        },
        outer: GlobalLexicalEnvironment
    }

    return () => {
        console.log(local);
        return local;
    }
    returnFunction получает ссылку на эту стрелочную функцию 
    Она имеет замыкание на doGlobalThingLexicalEnvironment, то есть "помнит" переменную local = 7
    returnFunction — это просто идентификатор , который ссылается на эту функцию
    ❗ На этом этапе returnFunction — это функция , которую можно вызвать как returnFunction(). 


    Вызов enotherFunction(returnFunction);
    Создаётся новый Execution Context для enotherFunction
    
    AnotherLexicalEnvironment = {
        environmentRecord: {
            doThing: [function],
            local: undefined
        },
        outer: GlobalLexicalEnvironment
    }

    Execution Phase
    local = 455;
    AnotherLexicalEnvironment = {
        environmentRecord: {
            doThing: [function],
            local: 455
        },
        outer: GlobalLexicalEnvironment
    }

    [Call Stack]
    ↑
    └──> doThing() → вызывает стрелочную функцию
    ↑
    └──> enotherFunction()
    ↑
    └──> returnFunction = doGlobalThing()
    ↑
    └──> global



    Итоговый
    GlobalLexicalEnvironment {
        environmentRecord: {
            theThing: 1,
            doGlobalThing: [function],
            returnFunction: [arrow function],
            enotherFunction: [function]
        },
        outer: null
        }

    doGlobalThingLexicalEnvironment {
        environmentRecord: {
            local: 7
        },
        outer: GlobalLexicalEnvironment
    }

    AnotherLexicalEnvironment {
        environmentRecord: {
            doThing: [arrow function],
            local: 455
        },
        outer: GlobalLexicalEnvironment
    }

    returnFunction — это функция?
    Да, возвращённая из doGlobalThing()

    Когда returnFunction становится функцией?
    После вызова doGlobalThing()
   
    returnFunction получает ссылку или копию?
    Ссылку + замыкание на окружение
 */