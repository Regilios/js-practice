const target =
  ev.target instanceof Element ? ev.target : ev.target?.parentElement;
/**
 * Проверка instanceof Element в JS используется для безопасного определения, является ли объект DOM-элементом,
 * и наследует ли он от класса Element. Это необходимо для предотвращения ошибок при попытке вызова методов узлов
 * (например, querySelector, addEventListener) на объектах, которые не являются HTML/XML-элементами
 *
 * Безопасная обработка DOM: Исключает ошибки, когда методы DOM вызываются у null, undefined или не-DOM объектов.
 *
 * Учет наследования: instanceof учитывает цепочку прототипов, проверяя, является ли элемент Element, HTMLElement, SVGElement и т.д.
 */

const children = parentNode.child?.children;
if (!children || children.size === 0) return;
/**
 * Всегда проверять размер получаемых записей. а не только их наличие
 */

setProps((next = {}));
Object.entries(next.parents);
/**
 *  setProps({
	    mode: "childcollapse" | null,
	    parents: { "s_1": { open:true, disabled:false }, "s_1_2": { open:false } }
	    // или массив:
	    // parents: [{ key:"s_1", open:true }, { el: liEl, disabled:true }]
	 
	    items: [
	      { el: liEl, disabled:true },
	      { selector: "#itemId", disabled:null }
	    ]
	  })

    Object.entries() метод возвращает массив собственных перечисляемых свойств указанного объекта в формате [key, value],
    в том же порядке, что и в цикле for...in (разница в том, что for-in перечисляет свойства из цепочки прототипов).
    Порядок элементов в массиве который возвращается Object.entries() не зависит от того как объект объявлен.

 */
