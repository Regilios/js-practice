for (let k = 0; k < 3; k++) { 
    outer: for (let i = 0; i < 10; i++) { 
        for (let j = 0; j < 10; j++) {
            let input = i+j+k;
            console.log(input);
            if (input == 3) {
                console.log("выход")
                break outer; // выйдем из всех циклов до outer
            }
        }
    }
}

/**
 * Метка имеет вид идентификатора с двоеточием перед циклом:
 * Вызов break <labelName> в цикле ниже ищет ближайший внешний цикл с такой меткой и переходит в его конец. 
 * */ 