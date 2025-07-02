var x = 42;
/**
 * 1: Лексический анализ (Lexing / Tokenization)

        → разбивается на лексемы:

        var → ключевое слово
        x → идентификатор
        = → оператор присвоения
        42 → числовой литерал

    2: Синтаксический анализ (Parsing)
        Парсер строит AST (Abstract Syntax Tree) — дерево, которое описывает структуру кода. 
        VariableDeclaration
            └── Identifier: x
            └── Literal: 42

    3: Creation Phase — создание Execution Context
        Каждый вызов функции, а также глобальная область создают свой Execution Context .
        Он состоит из: 

        LexicalEnvironment
        VariableEnvironment
        ThisBinding

            LexicalEnvironment vs VariableEnvironment
                LexicalEnvironment - Переменные, объявленные через let и const
                VariableEnvironment - Переменные, объявленные через var 
                Оба указывают на outer (внешнее) окружение , что формирует цепочку областей видимости (scope chain) 

        GlobalLexicalEnvironment = {
            environmentRecord: { здесь хранятся переменные  },
            outer: null,
        };   

        Для каждой области (глобальной или внутри функции):
        1. Функции (Function Declarations):
           Полностью поднимаются (hoisted)
           Добавляются в LexicalEnvironment и VariableEnvironment
        2. var переменные:
           Поднимаются и получают значение undefined
        3. let / const:
           Поднимаются, но остаются в Temporal Dead Zone (TDZ)
           Их значения не устанавливаются до строки объявления
        4. function параметры:
           Добавляются в LexicalEnvironment и инициализируются при вызове
        5. arguments объект:
           Создаётся только в обычных функциях (не в стрелочных)
     
    4: Execution Phase — выполнение кода
        После подготовки Execution Context переходит к фазе выполнения.
        Здесь происходят: 

        Присвоения (=, +=, ++)
        Вызовы функций
        Операции сравнения, математика, приведение типов   

    💡 Как работает весь процесс   
        [Пользовательский код]
                ↓
        1. Лексический анализ → создаются токены
                ↓
        2. Синтаксический анализ → строится AST
                ↓
        3. Создание Execution Context (Creation Phase)
            a. Функции полностью поднимаются
            b. var поднимаются и инициализируются в undefined
            c. let/const поднимаются, но не инициализируются (TDZ)
            d. Создаются ссылки на внешние окружения (outer)
                ↓
        4. Выполнение (Execution Phase)
            a. Присваиваются значения `let`, `const`, `var`
            b. Выполняются выражения, условия, циклы
            c. Вызываются функции → → → → → →  создаются новые Execution Context 💡 Каждый вызов функции создаёт новый Execution Context  который имеет своё собственное LexicalEnvironment.     
                ↓
        5. Возврат управления
            a. Контекст удаляется из стека
            b. Память может освободиться, если нет замыканий     

   

 */