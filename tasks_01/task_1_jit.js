function add(a, b) {
    return a + b;
}

// Версия 1 — с числами
for (let i = 0; i < 100000; i++) {
    add(1, 2);
}

%OptimizeFunctionOnNextCall(add);
add(1, 2);

console.log("First optimized version");

// Версия 2 — с объектами
for (let i = 0; i < 100000; i++) {
    add({}, {});
}

%OptimizeFunctionOnNextCall(add);
add({}, {});

console.log("Second optimized version");


/**
 * JIT (Just-In-Time) компиляция — это ключевая технология, которая позволяет JavaScript-движкам (вроде V8 в Chrome и Node.js) очень быстро выполнять код , за счёт его динамической оптимизации на лету .
 * Исходный код → Парсинг → Байт-код → Интерпретация → Компиляция в машинный код → Выполнение
 * Если какой-то участок кода выполняется часто , то его можно скомпилировать в машинный код (напрямую для процессора), чтобы он работал быстрее . 
 * Как это работает на практике
 * Интерпретатор запускает код
 * Profiler (профайлер) отслеживает, какие функции вызываются часто.
 * JIT компилирует этот участок в машинный код .
 * При следующем вызове вместо интерпретации используется уже скомпилированный и оптимизированный код.
 * 
 * JIT замечает, что a и b всегда числа, и оптимизирует эту функцию под сложение чисел, а не под универсальное сложение (например, строк или объектов).
 * Теперь эта функция работает как настоящий нативный код .
 * 
 *  Inline caching
    Запоминает типы данных, с которыми работает функция, чтобы ускорить доступ к свойствам объектов.
  
    Hidden classes
    Используются в движках типа V8 для эффективного представления объектов (похоже на классы в C++/Java).
   
    Inlining
    Подставляет тело часто вызываемой функции прямо в место вызова, чтобы избежать overhead'а.
   
    Dead code elimination
    Убирает код, который никогда не используется.
   
    Type specialization
    Генерирует специализированный код под конкретные типы данных.

    Если JIT сделал предположение о типах, но оно оказалось неверным (например, ты внезапно передал строку вместо числа), тогда:
    Код демонтируется (deoptimized).
    Возвращается к интерпретируемому варианту.
    Профайлер снова собирает данные.
    Новый машинный код может быть сгенерирован.
    Это занимает время, но в целом всё равно выигрыш остаётся.

    Terminal:> node --allow-natives-syntax --trace-opt --trace-deopt task_1_jit.js
    Вернёт:
    [marking 0x031c7f52bc61 <JSFunction add (sfi = 000000C6E65427F1)> for optimization to TURBOFAN, ConcurrencyMode::kConcurrent, reason: hot and stable]
    [compiling method 0x031c7f52bc61 <JSFunction add (sfi = 000000C6E65427F1)> (target TURBOFAN), mode: ConcurrencyMode::kConcurrent]
    [marking 0x031c7f52b281 <JSFunction (sfi = 000000C6E6542789)> for optimization to TURBOFAN, ConcurrencyMode::kConcurrent, reason: hot and stable]
    [compiling method 0x031c7f52b281 <JSFunction (sfi = 000000C6E6542789)> (target TURBOFAN) OSR, mode: ConcurrencyMode::kConcurrent]
    [completed compiling 0x031c7f52bc61 <JSFunction add (sfi = 000000C6E65427F1)> (target TURBOFAN) - took 0.033, 1.215, 0.021 ms]
    [completed optimizing 0x031c7f52bc61 <JSFunction add (sfi = 000000C6E65427F1)> (target TURBOFAN)]
    [completed compiling 0x031c7f52b281 <JSFunction (sfi = 000000C6E6542789)> (target TURBOFAN) OSR - took 0.013, 0.903, 0.017 ms]
    [completed optimizing 0x031c7f52b281 <JSFunction (sfi = 000000C6E6542789)> (target TURBOFAN) OSR]
    [bailout (kind: deopt-eager, reason: Insufficient type feedback for call): begin. deoptimizing 0x031c7f52b281 <JSFunction (sfi = 000000C6E6542789)>, 0x0135b3cc3bd1 <Code TURBOFAN>, opt id 1, bytecode offset 43, deopt exit 4, FP to SP delta 104, caller SP 0x002efc9febd0, pc 0x7ff779cc81dd]
    Warn!
    [bailout (kind: deopt-eager, reason: not a Smi): begin. deoptimizing 0x031c7f52bc61 <JSFunction add (sfi = 000000C6E65427F1)>, 0x0135b3cc3a01 <Code TURBOFAN>, opt id 0, bytecode offset 2, deopt exit 0, FP to SP delta 32, caller SP 0x002efc9feb38, pc 0x7ff779cc7ff5]
    Done!


    [marking 0x031c7f52bc61 <JSFunction add ...> for optimization to TURBOFAN, reason: hot and stable] → Функция add стала "горячей", значит, её стоит оптимизировать.
    [compiling method 0x031c7f52bc61 ... mode: ConcurrencyMode::kConcurrent] → Компиляция происходит в фоновом потоке , чтобы не тормозить выполнение основного кода.
    deoptimizing 0x031c7f52bc61 - деоптимизация
 */