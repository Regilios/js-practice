'use strict';

const Point = class {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
};

const serializable = (Category) => class extends Category {
  toString() {
    return `[${this.x}, ${this.y}]`;
  }
};

const movable = (Category) => class extends Category {
  move(x, y) {
    this.x += x;
    this.y += y;
  }
};

const PointEx = serializable(movable(Point));  
const point1 = new PointEx(10, 20);
point1.move(5, -2);
console.log(point1.toString());

const { x, y } = point1;
console.log(x, y);

//  миксин-ориентированный паттерн с использованием декораторов класса
/**
 * Фаза парсинга AST  - опущены
 * 
 *  1: Creation Phase (Глобальный Execution Context)
        GlobalLexicalEnvironment = {
            environmentRecord: {
                Point: <uninitialized>,
                serializable: <uninitialized>,
                movable: <uninitialized>,
                PointEx: <uninitialized>,
                point1: <uninitialized>,
                x: <uninitialized>,
                y: <uninitialized>
            },
            outer: null
        };

    2: Execution Phase (Выполняется строка за строкой)
        Строка: const Point = class { ... };
        Объявляется переменная Point
        Ей присваивается ссылка на анонимный класс
        Point = class {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
        };

        const serializable = (Category) => class extends Category { ... } это обычная стрелочная функция, которая принимает Category и возвращает новый класс. То же самое: movable

        Вызов serializable(movable(Point)) 
            Вызывается миксин movable, передаётся Point как Category
            class MovablePoint extends Point {
                move(x, y) {
                    this.x += x;
                    this.y += y;
                }
            }

            serializable(MovablePoint) Теперь MovablePoint передаётся как Category в serializable. 
            class SerializableMovablePoint extends MovablePoint {
                toString() {
                    return `[${this.x}, ${this.y}]`;
                }
            }

            PointEx — это ссылка на SerializableMovablePoint, то есть на класс с двумя методами

            [Lexical Environments]

                SerializableLexicalEnvironment = {
                    environmentRecord: {},
                    outer: MovableLexicalEnvironment
                }

                MovableLexicalEnvironment = {
                    environmentRecord: {},
                    outer: PointLexicalEnvironment
                }

                PointLexicalEnvironment = {
                    environmentRecord: {},
                    outer: GlobalLexicalEnvironment
                }

            GlobalLexicalEnvironment = {
                environmentRecord: {
                    Point: [class],      💡  Классы не добавляют свои собственные переменные в LexicalEnvironment, только методы в прототипах 
                    serializable: [function],
                    movable: [function],
                    PointEx: [class],
                    point1: <uninitialized>,
                    x: <uninitialized>,
                    y: <uninitialized>
                },
                outer: null
            };

         💡 Присваивание const point1 = new PointEx(10, 20); -  это объект, а не функция или класс    
            Он живёт в куче (heap) , а его ссылка сохраняется в LexicalEnvironment как: point1: <Object>, подробнее ниже

            GlobalLexicalEnvironment = {
                environmentRecord: {
                    Point: [class],      
                    serializable: [function],
                    movable: [function],
                    PointEx: [class],
                    point1: <Object>,
                    x: <uninitialized>,
                    y: <uninitialized>
                },
                outer: null
            };
            
            Вызывается конструктор PointEx, который:

            Вызывает super(...) → constructor из Point
            Устанавливает x = 10, y = 20
            Внутренне состояние point1:
            point1 = {
                x: 10,
                y: 20
            }

            GlobalLexicalEnvironment = {
                environmentRecord: {
                    Point: [class],      
                    serializable: [function],
                    movable: [function],
                    PointEx: [class],
                    point1: { x: 15, y: 18 },
                    x: <uninitialized>,
                    y: <uninitialized>
                },
                outer: null
            };
            
       

        💡 Классы — это функции сlass {} === function Point() {}
            Класс — это функция , которая при вызове с new создаёт экземпляр (объект)
            point1 — это не класс , это результат выполнения конструктора
            То есть point1 — это объект , созданный экземпляром класса

            const point1 = new PointEx(10, 20);
            Вызов new Class(...) делает следующее:
                Создание нового объекта — {}
                Установка прототипа — Object.setPrototypeOf(point1, PointEx.prototype)
                Вызов constructor() — this.x = x; this.y = y;
                Возврат point1 — Объект { x: 10, y: 20 }

                class Foo {}
                typeof Foo;           // "function"
                typeof new Foo();     // "object"

            [Heap Memory]
                point1 = {
                    x: 15,
                    y: 18,
                    __proto__: PointEx.prototype
                }

        💡 Методы класса — в прототипе. Не в окружении, а в prototype
        💡 this — контекст экземпляра. Указывает на текущий объект

 */
