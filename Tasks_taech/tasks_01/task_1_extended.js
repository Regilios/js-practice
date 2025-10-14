'use strict';

const Point = class {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
};

const serializable = (Category) => class extends Category { // возвращаем новый расширенный класс с методом toString
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

// Usage

const PointEx = serializable(movable(Point));  // возвращаем новый расширенный класс с методом move а после ещё новой класс с методотом toString и уже унаследованынм move
const point1 = new PointEx(10, 20);
point1.move(5, -2);
console.log(point1.toString()); // [15, 18]

const { x, y } = point1;
console.log(x, y); // 15 18