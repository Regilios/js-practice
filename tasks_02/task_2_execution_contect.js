/* 
    Execution Context (Контекст выполнения), и он состоит из двух основных частей

    💡 Variable Environment (Lexical Environment) - Хранит объявления переменных (var,let,const) и функций 
    This Binding Определяет значение this внутри контекста

    💡 Lexical Environment (Лексическое окружение)
    Это формальная структура данных , описанная в спецификации ECMAScript. 

    Она отвечает за:

    Хранение переменных, функций и других объявлений
    Связь с внешним лексическим окружением (outer environment)

*/
function foo() {
    const x = 10;
    
    function bar() {
        console.log(x); // 10
    }
    
    bar();
}
/* 
    Здесь у нас есть:

    Глобальное лексическое окружение
    Лексическое окружение foo
    Лексическое окружение bar
    Каждое внутреннее окружение имеет ссылку на внешнее → формируется цепочка областей видимости (scope chain) .

    💡 Scope Chain (Цепочка областей видимости)
    Это список лексических окружений , которые JS использует для поиска переменных. 

    Как работает поиск переменной?
    Если JS не находит переменную внутри текущего окружения, он идёт "вверх" по цепочке, пока не найдёт её или не выбросит ReferenceError.


    💡 Execution Context (Контекст выполнения)
    Это абстракция, которая помогает JS-движку понять, что сейчас выполняется и в какой области видимости . 

    Каждый вызов функции создаёт новый Execution Context , который помещается в Call Stack (стек вызовов) .

    Контекст выполнения состоит из:
    LexicalEnvironment - Переменные, функции, объявленные внутри функции
    VariableEnvironment - Объявления через var
    ThisBinding - Значение this

    💡 Call Stack (Стек вызовов) -  механизм, который отслеживает, какие функции сейчас выполняются 
*/
function third() { console.trace(); }
function second() { third(); }
function first() { second(); }

first();
/*
    third @ VM...:2
    second @ VM...:5
    first @ VM...:8

    💡
    Шаги выполнения:
    Создаётся глобальный Execution Context
    В нём определяются все глобальные переменные и функции
    Формируется глобальное Lexical Environment

    При вызове функции создаётся новый Execution Context
    Он добавляется в call stack
    Для этой функции создаётся новое Lexical Environment
    Оно ссылается на внешнее (outer) окружение — то, где была объявлена функция
    После завершения функции её контекст удаляется из стека
    Но если есть замыкание, её окружение может быть сохранено
*/

let x = 1;

function foo() {
    let y = 2;

    function bar() {
        let z = 3;
        console.log(x + y + z);
    }

    bar();
}

foo();
/** 
 *  💡💡💡💡
 *  JavaScript работает в двух фазах :
    1. Creation — подготовка переменных и функций
    2. Execution — выполнение кода


    1.  Глобальный Execution Context создается первым
        LexicalEnvironment - { x: <uninitialized>, foo: [function] }
        VariableEnvironment - { x: <uninitialized>, foo: [function] }

        - Переменная x находится в состоянии Temporal Dead Zone (TDZ) до её объявления (let x = 1), поэтому обращение к ней раньше вызывает ошибку.

        После инициализации: x получает значение 1 Теперь доступна во всей области видимости

        Лексическое окружение после создания:
        
        GlobalLexicalEnvironment = {  - глобальная область видимости
            environmentRecord: {
                x: 1,
                foo: [function]
            },
            outer: null // глобальная область — самая верхняя
        };

    2.  Phase: Execution Phase (Фаза выполнения)
        Все переменные готовы, теперь выполняется код.
        Вызывается функция foo() → создаётся новый Execution Context.

        LexicalEnvironment - { y: <uninitialized>, bar: [function] }
        VariableEnvironment - { y: <uninitialized>, bar: [function] }
        thisBinding - для this

        let y = 2;
        y = 2 записывается в LexicalEnvironment функции foo
       
        FooLexicalEnvironment = { - область видимости для foo
            environmentRecord: {
                y: 2,
                bar: [function]
            },
            outer: GlobalLexicalEnvironment - ссылка на глоабльную область, для восхождения по цепочке
        }

        Создание функции bar
        Функция bar хранится в environmentRecord foo
        У неё тоже будет своё лексическое окружение

        BarLexicalEnvironment = {
            environmentRecord: {
                z: <uninitialized>
            },
            outer: FooLexicalEnvironment - ссылка на область видимости foo, для восхождения по цепочке
        }


        Вызываем bar() внутри foo():    
        Создание Execution Context для bar
        LexicalEnvironment - { z: <uninitialized> }
        VariableEnvironment - { z: <uninitialized> }

        Инициализация z let z = 3;
        Переменная z записывается в LexicalEnvironment функции bar
        BarLexicalEnvironment = {
            environmentRecord: {
                z: 3
            },
            outer: FooLexicalEnvironment
        }

        Выполнение console.log(x + y + z)
        JS начинает выполнять тело bar():
        JS ищет переменные по цепочке областей видимости:

        Сначала ищет z в BarLexicalEnvironment → находит
        Ищет y в BarLexicalEnvironment → не находит , идёт в outer (в FooLexicalEnvironment) → находит
        Ищет x в FooLexicalEnvironment → не находит , идёт в его outer (в GlobalLexicalEnvironment) → находит

        Call Stack (Стек вызовов)
        JavaScript использует call stack , чтобы отслеживать, какие функции сейчас выполняются.
        Начало работы      [global]
        Вызов foo()        [global, foo]
        Вызов bar()        [global, foo, bar]
        Выход из bar()     [global, foo]
        Выход из foo()     [global]

        Код работает благодаря: 

        LexicalEnvironment — структуре, которая хранит переменные
        Closure — функции "запоминают" своё лексическое окружение
        Call Stack — отслеживает порядок выполнения
        Scope Chain — позволяет искать переменные "вверх"

        гда ты пишешь function, JavaScript запоминает: 

        Где эта функция была объявлена
        Какое окружение было активным на тот момент
        Именно поэтому замыкания работают — функции "помнят", где они были созданы.
 */