/* 
    Когда функция вызывается как new User(...), происходит следующее:

    Создаётся новый пустой объект, и он присваивается this.
    Выполняется тело функции. Обычно оно модифицирует this, добавляя туда новые свойства.
    Возвращается значение this.
    Другими словами, new User(...) делает что-то вроде:

    function User(name) {
    // this = {};  (неявно)

    // добавляет свойства к this
    this.name = name;
    this.isAdmin = false;

    // return this;  (неявно)
    }

    Таким образом, let user = new User("Jack") возвращает тот же результат, что и:.
    let user = {
        name: "Jack",
        isAdmin: false
    };
*/


function User(name) {
  this.name = name;
  this.isAdmin = false;
}

let user = new User("Jack");

alert(user.name); // Jack
alert(user.isAdmin); // false

/*
Возврат значения из конструктора, return
Обычно конструкторы не имеют оператора return. Их задача – записать все необходимое в this, и это автоматически становится результатом.

Но если return всё же есть, то применяется простое правило:

При вызове return с объектом, вместо this вернётся объект.
При вызове return с примитивным значением, оно проигнорируется.
Другими словами, return с объектом возвращает этот объект, во всех остальных случаях возвращается this.

К примеру, здесь return замещает this, возвращая объект:
 */
{
    function BigUser() {
        this.name = "John";
        return { name: "Godzilla" };  // <-- возвращает этот объект
    }

    alert( new BigUser().name );  // Godzilla, получили этот объект
}
// А вот пример с пустым return (или мы могли бы поставить примитив после return, неважно):
{
    function SmallUser() {
        this.name = "John";
        return; // <-- возвращает this
    }

    alert( new SmallUser().name );  // John
}