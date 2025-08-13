    function counter() {
        let count = 0;
        return {
            count,
            increment: () => ++count
        };
    }

    const { count, increment } = counter();
    increment();
    console.log(count);

/** 
 *  💡💡💡💡
    Глобальный Execution Context создаётся первым:
    LexicalEnvironment - { counter: [function], count: <uninitialized>, increment: <uninitialized> }
    VariableEnvironment - { counter: [function], count: <uninitialized>, increment: <uninitialized> }
    Процесс хостинга (hoisting)

    Execution Phase (Фаза выполнения)
    1.  Вызов counter() — создаётся новый Execution Context
        GlobalLexicalEnvironment = {
            environmentRecord: {
                counter: [function],
                count: <uninitialized>,
                increment: <uninitialized>
            },
            outer: null
        };
        Переменные count и increment находятся в Temporal Dead Zone , пока не будет выполнена строка: 
        const { count, increment } = counter();

    2.  Вызов counter()
        Вызывается функция counter() → создаётся новый Execution Context.

        Что происходит:
        Функция counter поднимается полностью (функции поднимаются целиком)
        Переменная count объявлена через let, поэтому она находится в Temporal Dead Zone (TDZ) до строки const { count, increment } = counter();
        Но так как count и increment объявлены через const, они не инициализируются до выполнения присвоения

        let и const поднимаются , но остаются недоступными до строки объявления → TDZ

        LexicalEnvironment внутри counter:
        CounterLexicalEnvironment = {
            environmentRecord: {
                count: 0
            },
            outer: GlobalLexicalEnvironment
        };

        Функция возвращает объект:
        {
            get count() { return count; },   // геттер, связанный с этим окружением
            increment: () => ++count          // стрелочная функция, связанная с этим окружением
        }
        Так как обе части (get count() и increment) имеют доступ к переменной count, они ссылаются на одно и то же лексическое окружение.

    3. Деструктуризация и присвоение    
        const { count, increment } = counter();
        Возвращённый объект содержит:

        get count() — геттер, который ссылается на внутреннюю переменную count
        increment — стрелочная функция, которая тоже ссылается на эту же переменную
        После деструктуризации:

        count = вызов геттера → возвращает значение `count` из CounterLexicalEnvironment
        increment = () => ++count → замыкание, связанное с тем же окружением
        count — результат вызова геттера на момент создания объекта
        increment — функция, которая мутирует внутреннюю переменную count

    4.  Вызов increment()
        Стрелочная функция:

        Не имеет собственного this
        Не имеет собственного arguments
        Но имеет ссылку на внешнее лексическое окружение , где была объявлена
        В данном случае:

        increment была создана внутри counter
        Поэтому она ссылается на CounterLexicalEnvironment.count
        При вызове ++count изменяется count = 1

    5.  Вывод console.log(count)
        Это не ссылка на переменную , а результат вызова геттера , который динамически обращается к count внутри counter 

    Визуализация цепочки окружений
        [Call Stack]
        ↑
        └──> console.log(count) → вызывает геттер → обращается к CounterLexicalEnvironment.count = 1
        ↑
        └──> increment() → увеличивает CounterLexicalEnvironment.count до 1
        ↑
        └──> counter() → создаёт новое окружение с count = 0 и возвращает объект с геттером и инкрементом
        ↑
        └──> global → запуск кода

        (Вид вызова)
        [global]
        └──> counter()
                └──> increment() // мутирует count внутри counter
        └──> console.log(count) // обращается к геттеру, который читает count


        [Lexical Environments]

        CounterLexicalEnvironment = {
            environmentRecord: {
                count: 1
            },
            outer: GlobalLexicalEnvironment
        }

        GlobalLexicalEnvironment = {
            environmentRecord: {
                counter: [function],
                count: [getter],      // ← получено через деструктуризацию
                increment: [arrow function]
            },
            outer: null
        }
 */