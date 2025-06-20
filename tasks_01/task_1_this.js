function foo() {
	console.log( this.bar );
}

var bar = "global";

var obj1 = {
	bar: "obj1",
	foo: foo
};

var obj2 = {
	bar: "obj2"
};

//--------

foo();				// "global"
obj1.foo();			// "obj1"
foo.call( obj2 );	// "obj2"
new foo();			// undefined

/**
 *  Есть четыре правила того, как устанавливается this, и они показаны в этих четырех последних строках кода.

    foo() присваивает в this ссылку на глобальный объект в нестрогом режиме. В строгом режиме, this будет undefined, и вы получите ошибку при доступе к свойству bar, поэтому "global" — это значение для this.bar.
    obj1.foo() устанавливает this в объект obj1.
    foo.call(obj2) устанавливает this в объект obj2.
    new foo() устанавливает this в абсолютно новый пустой объект.
 */