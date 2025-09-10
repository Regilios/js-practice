var MV = {
    activeMenu: function() {
        document.querySelectorAll('.dsvc-automenu').forEach((el) => {
            // ------------------- created elements -------------------
            let ul = el;

            const liMore = document.createElement('li');
            liMore.className = 'more';
            const liClean = document.createElement('li');
            liClean.className = 'clean';
            const divMoreText = document.createElement('div');
            divMoreText.className = 'more-text';
            divMoreText.textContent = 'Ещё';
            const ulDrop = document.createElement('ul');
            ulDrop.className = 'more-drop';
            liMore.append(divMoreText, ulDrop);

            let flagMoreCreated = false; // проверка создания more (ещё)
            let itemsFirstLi = null; // первый li в drop 
            let itemsWidthFirstLi = null; // ширина первого li в drop 
            let widthliInner = null; // ширина первого li в drop с учётом паддингов
            let widthLiClean = null; // ширина заполнителя на месте убранных li
            let pLeft = null; // padding left li
            let pRight = null; // padding right li
            let listLiUpdated = null; // текущий список li с учётом more clean
            let listLi = null; // основной список li без more clean
            let positionAppend = 0; // позиция для добавления li из drop обртано на место с учётом текущего основно списка
            let ulBound = 0; // right позиция ul на экране
            let widthMore = 0; // ширина элемента more (ещё)
            let openListneer = false; // проверка создания слушателя для more (ещё)
            let previousWidth = ul.getBoundingClientRect().width; // отслеживаем предыдущую ширину

            // ------------------- helpers -------------------
            function openDrop(liMore, ulDrop) {
                let heightMore = liMore.getBoundingClientRect().height;
                ulDrop.style.setProperty('--height-more', heightMore + 'px');

                liMore.addEventListener('mouseenter', function() {
                    if (!liMore.classList.contains('open')) {
                        liMore.classList.add('open');
                    }
                });
                liMore.addEventListener('mouseleave', function() {
                    removeOpenClass(liMore);
                });
                ulDrop.addEventListener('mouseleave', function() {
                    removeOpenClass(ulDrop);
                });

                function removeOpenClass(wrapper) {
                    wrapper.classList.remove('open');
                }
            }

            function wrapContent(element, wrapperTag = 'div') {
                if (!element) return null;
                if (element.classList.contains('inner')) return null;

                const wrapper = document.createElement(wrapperTag);
                wrapper.className = 'wrapper';
                const children = Array.from(element.childNodes);

                children.forEach((child) => wrapper.appendChild(child));
                element.appendChild(wrapper);
                element.classList.add('inner');
                return wrapper;
            }

            function unWrapContent(element) {
                if (!element) return null;
                element.classList.remove('inner');
                const wrapperDiv = element.querySelector('.wrapper');

                if (wrapperDiv) {
                    wrapperDiv.classList.remove('wrapper');
                    element.innerHTML = wrapperDiv.innerHTML;
                }
                return element;
            }

            function getList() {
                return el.querySelectorAll('ul li:not(.more):not(.clean)');
            }

            function resetVariables() {
                positionAppend = 0;
                listLiUpdated = null;
                itemsFirstLi = null;
                itemsWidthFirstLi = null;
                listLi = null;
                pLeft = null;
                pRight = null;
            }

            // ------------------- main  -------------------
            function buildMenu() {
                if (!listLi) {
                    listLi = getList();
                }

                if (listLi.length === 0) return;

                if (!pLeft && !pRight) {
                    pLeft = parseInt(getComputedStyle(listLi[0]).paddingLeft);
                    pRight = parseInt(getComputedStyle(listLi[0]).paddingRight);
                }

                ulBound = ul.getBoundingClientRect().right;

                Array.from(listLi).reverse().forEach(element => {
                    let liBound = element.getBoundingClientRect().right;

                    if (flagMoreCreated) {
                        widthMore = el.querySelector('.more').getBoundingClientRect().width;
                        liBound = liBound + widthMore + 25; // +25 добавляем чтобы срабатывал чуть раньше чем коснётся ещё
                    }

                    if (ulBound <= liBound) {
                        if (!flagMoreCreated) {
                            ul.append(liClean, liMore);
                            flagMoreCreated = true;
                        }
                        wrapContent(element);
                        ulDrop.prepend(element);

                        if (!openListneer) {
                            openDrop(liMore, ulDrop);
                            openListneer = true;
                        }

                        itemsFirstLi = null;
                        itemsWidthFirstLi = null;
                    }
                });

                resetVariables();
            }

            function disassemblyMenu() {
                if (!flagMoreCreated) return; // Если "Ещё" не создано, нечего возвращать

                if (!itemsFirstLi) {
                    itemsFirstLi = ul.querySelector('ul.more-drop li:first-child');
                }

                if (!itemsFirstLi) {
                    // Если в "Ещё" нет элементов, удаляем его
                    liMore.remove();
                    liClean.remove();
                    flagMoreCreated = false;
                    openListneer = false;
                    resetVariables();
                    return;
                }

                let processedAny = false;

                // Обрабатываем все элементы, которые могут поместиться
                while (itemsFirstLi) {
                    itemsWidthFirstLi = itemsFirstLi.querySelector('.wrapper');
                    if (!itemsWidthFirstLi) break;

                    if (ulDrop.childNodes.length > 1) {
                        widthLiClean = liClean.getBoundingClientRect().width;
                    } else {
                        widthLiClean = liClean.getBoundingClientRect().width + widthMore - 25;
                    }

                    widthliInner = pLeft + pRight + itemsWidthFirstLi.getBoundingClientRect().width;

                    if (widthLiClean > widthliInner) {
                        unWrapContent(itemsFirstLi);
                        if (!listLiUpdated) {
                            listLiUpdated = ul.querySelectorAll('ul:not(li ul) > li');
                        }

                        positionAppend = listLiUpdated.length - 2;
                        ul.insertBefore(itemsFirstLi, listLiUpdated[positionAppend]);
                        processedAny = true;

                        // Обновляем ссылку на следующий элемент
                        itemsFirstLi = ul.querySelector('ul.more-drop li:first-child');

                        if (!itemsFirstLi) {
                            // Если больше нет элементов, удаляем "Ещё"
                            liMore.remove();
                            liClean.remove();
                            flagMoreCreated = false;
                            openListneer = false;
                            break;
                        }
                    } else {
                        break; // Элемент не помещается - выходим
                    }
                }

                if (processedAny) {
                    resetVariables();
                }
            }

            function handleResize(entries) {
                for (let entry of entries) {
                    const currentWidth = entry.contentRect.width;

                    if (currentWidth > previousWidth && flagMoreCreated) {
                        // Окно увеличилось и есть элементы в "Ещё" - пытаемся вернуть их
                        disassemblyMenu();
                    } else if (currentWidth < previousWidth) {
                        // Окно уменьшилось - проверяем, нужно ли убрать элементы в "Ещё"
                        buildMenu();
                    }

                    previousWidth = currentWidth;
                }
            }

            // Создаем ResizeObserver для отслеживания изменений размера меню
            const resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(ul);

            // Инициализация при загрузке
            buildMenu();
        });
    },
};

document.addEventListener('DOMContentLoaded', () => {
    MV.activeMenu();
});