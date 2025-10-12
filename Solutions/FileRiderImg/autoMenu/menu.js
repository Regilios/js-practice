var MV = {
    activeMenu: function() {
        document.querySelectorAll('.dsvc-am').forEach((el) => {
            requestAnimationFrame(() => {
                // ------------------- created elements -------------------
                let ul = el
                const PADDING_RESERVE = 25
                const HEIGHT_MENU = 56
                const liMore = document.createElement('li')
                liMore.className = 'dsvc-more-am'
                const liClean = document.createElement('li')
                liClean.className = 'dsvc-clean-am'
                const divMoreText = document.createElement('div')
                divMoreText.className = 'dsvc-more-text'
                divMoreText.textContent = 'Ещё'
                const ulDrop = document.createElement('ul')
                ulDrop.className = 'dsvc-more-drop-am'
                liMore.append(divMoreText, ulDrop)

                let flagMoreCreated = false // проверка создания more (ещё)
                let itemsFirstLi = null // первый li в drop
                let itemsWidthFirstLi = null // ширина первого li в drop
                let widthliInner = null // ширина первого li в drop с учётом паддингов
                let widthLiClean = null // ширина заполнителя на месте убранных li
                let pLeft = null // padding left li
                let pRight = null // padding right li
                let listLiUpdated = null // текущий список li с учётом more clean
                let listLi = null // основной список li без more clean
                let ulBound = 0 // right позиция ul на экране
                let widthMore = 0 // ширина элемента more (ещё)
                let openListneer = false // проверка создания слушателя для more (ещё)
                let previousWidth = ul.getBoundingClientRect().width // отслеживаем предыдущую ширину

                // ------------------- helpers -------------------
                // инициализирум свои дропы т.к. бутстраповские ломаются
                function initAppointDropdown() {
                    let dropdownMenu = ul.querySelectorAll('.dsvc-dropdown')

                    dropdownMenu.forEach((element) => {
                        element
                            .querySelector('.dsvc-dropdown-menu')
                            .style.setProperty('--height-dropdown', HEIGHT_MENU + 'px')

                        let dropMenuList = element.querySelector('.dsvc-dropdown-menu')

                        element.addEventListener('click', function(event) {
                            // Проверяем, был ли клик по ссылке или её дочерним элементам
                            if (event.target.closest('.dsvc-dropdown-btn')) {
                                event.preventDefault()
                                event.stopPropagation()
                                dropMenuList.classList.toggle('dsvc-open-dropdown')
                            }
                        })
                    })

                    // Закрытие при клике вне dropdown
                    document.addEventListener('click', function(event) {
                        dropdownMenu.forEach((element) => {
                            const menu = element.querySelector('.dsvc-dropdown-menu')
                            if (!element.contains(event.target)) {
                                menu.classList.remove('dsvc-open-dropdown')
                            }
                        })
                    })
                }
                // дропер для Ещё	
                function openDrop(liMore, ulDrop) {
                    ulDrop.style.setProperty('--height-more', HEIGHT_MENU + 'px')

                    liMore.addEventListener('mouseenter', function() {
                        if (!liMore.classList.contains('dsvc-open-am')) {
                            liMore.classList.add('dsvc-open-am')
                        }
                    })

                    liMore.addEventListener('mouseleave', function() {
                        removeOpenClass(liMore)
                    })

                    ulDrop.addEventListener('mouseleave', function() {
                        let allDrop = document.querySelectorAll('.dsvc-dropdown-menu')
                        allDrop.forEach((element) => {
                            element.classList.remove('dsvc-open-dropdown')
                        })
                        removeOpenClass(ulDrop)
                    })

                    function removeOpenClass(wrapper) {
                        wrapper.classList.remove('dsvc-open-am')
                    }
                }
                // Обёртка для элементов внутри ещё для вычисления точной ширины	
                function wrapContent(element, wrapperTag = 'div') {
                    if (!element) return null
                    if (element.classList.contains('dsvc-inner-am')) return null

                    const wrapper = document.createElement(wrapperTag)
                    wrapper.className = 'dsvc-wrapper-am'

                    // находим первый-level подменю (если есть) — элемент UL среди children
                    const subMenu = Array.from(element.children).find(
                        (c) => c.tagName === 'UL'
                    )

                    // берем все childNodes (включая текст/anchor), но исключаем сам subMenu
                    const children = Array.from(element.childNodes)
                    children.forEach((child) => {
                        if (child !== subMenu) wrapper.appendChild(child)
                    })

                    // очистить li и вставить wrapper, затем вернуть subMenu (если был)
                    element.innerHTML = ''
                    element.appendChild(wrapper)
                    if (subMenu) element.appendChild(subMenu)

                    element.classList.add('dsvc-inner-am')
                    return wrapper
                }
                // Удаление обёртки когда возвращаем пунткты назад в меню	
                function unWrapContent(element) {
                    if (!element) return null

                    element.classList.remove('dsvc-inner-am')

                    // ищем wrapper только среди прямых детей (children)
                    const wrapperDiv = Array.from(element.children).find((c) =>
                        c.classList ? c.classList.contains('dsvc-wrapper-am') : false
                    )
                    const subMenu = Array.from(element.children).find(
                        (c) => c.tagName === 'UL'
                    )

                    if (wrapperDiv) {
                        // сохраняем содержимое wrapper
                        const wrapperChildren = Array.from(wrapperDiv.childNodes)

                        // очистим li и вернём содержимое wrapper назад
                        element.innerHTML = ''
                        wrapperChildren.forEach((child) => element.appendChild(child))

                        // если был subMenu — вставляем его после контента
                        if (subMenu) element.appendChild(subMenu)
                    }

                    return element
                }
                // получаем список меню без управляющих элементов
                function getList() {
                    return Array.from(ul.children).filter((node) => {
                        return (
                            node.tagName === 'LI' &&
                            !node.classList.contains('dsvc-more-am') &&
                            !node.classList.contains('dsvc-clean-am')
                        )
                    })
                }
                // сброс всех флагов
                function resetVariables() {
                    positionAppend = 0
                    listLiUpdated = null
                    itemsFirstLi = null
                    itemsWidthFirstLi = null
                    listLi = null
                    pLeft = null
                    pRight = null
                }

                // ------------------- main  -------------------
                // перекидываем пунткты в ещё
                function buildMenu() {
                    if (!listLi) {
                        listLi = getList()
                    }

                    if (listLi.length === 0) return

                    if (!pLeft && !pRight) {
                        pLeft = parseInt(getComputedStyle(listLi[0]).paddingLeft)
                        pRight = parseInt(getComputedStyle(listLi[0]).paddingRight)
                    }

                    ulBound = ul.getBoundingClientRect().right

                    Array.from(listLi)
                        .reverse()
                        .forEach((element) => {
                            let liBound = element.getBoundingClientRect().right

                            if (flagMoreCreated) {
                                widthMore = el
                                    .querySelector('.dsvc-more-am')
                                    .getBoundingClientRect().width
                                liBound = liBound + widthMore + PADDING_RESERVE // добавляем чтобы срабатывал чуть раньше чем коснётся ещё
                            }

                            if (ulBound <= liBound) {
                                if (!flagMoreCreated) {
                                    ul.append(liClean, liMore)
                                    flagMoreCreated = true
                                }
                                wrapContent(element)
                                ulDrop.prepend(element)

                                if (!openListneer) {
                                    openDrop(liMore, ulDrop)
                                    openListneer = true
                                }
                                //appointDropdown('modifine')
                                itemsFirstLi = null
                                itemsWidthFirstLi = null
                            }
                        })

                    resetVariables()
                }
                // вытаскиваем пункты из ещё	
                function disassemblyMenu() {
                    if (!flagMoreCreated) return // Если "Ещё" не создано, нечего возвращать

                    if (!itemsFirstLi) {
                        itemsFirstLi = ul.querySelector('ul.dsvc-more-drop-am li:first-child')
                    }

                    if (!itemsFirstLi) {
                        // Если в "Ещё" нет элементов, удаляем его
                        liMore.remove()
                        liClean.remove()
                        flagMoreCreated = false
                        openListneer = false
                        resetVariables()
                        return
                    }

                    let processedAny = false

                    // Обрабатываем все элементы, которые могут поместиться
                    while (itemsFirstLi) {
                        itemsWidthFirstLi = itemsFirstLi.querySelector('.dsvc-wrapper-am')
                        if (!itemsWidthFirstLi) break

                        if (ulDrop.childNodes.length > 1) {
                            widthLiClean = liClean.getBoundingClientRect().width
                        } else {
                            widthLiClean =
                                liClean.getBoundingClientRect().width +
                                widthMore -
                                PADDING_RESERVE //  запас для разворота
                        }

                        widthliInner =
                            pLeft + pRight + itemsWidthFirstLi.getBoundingClientRect().width

                        //console.log("widthliInner ", widthliInner);
                        //console.log("widthLiClean ", widthLiClean);

                        if (widthLiClean > widthliInner) {
                            // вернуть внешний вид пункта
                            unWrapContent(itemsFirstLi)

                            // подготовим список верхнеуровневых li (если ещё не сделали)
                            if (!listLiUpdated) {
                                listLiUpdated = Array.from(ul.children).filter((node) => {
                                    return (
                                        node.tagName === 'LI' &&
                                        !node.classList.contains('dsvc-more-am') &&
                                        !node.classList.contains('dsvc-clean-am')
                                    )
                                })
                            }

                            // референтная нода — вставляем прямо перед placeholder'ом (или перед more если clean нет)
                            const refNode =
                                ul.querySelector('li.dsvc-clean-am') ||
                                ul.querySelector('li.dsvc-more-am') ||
                                null

                            ul.insertBefore(itemsFirstLi, refNode)
                                //appointDropdown('default')
                            processedAny = true

                            // обновляем ссылку на следующий элемент в "Ещё"
                            itemsFirstLi = ul.querySelector(
                                'ul.dsvc-more-drop-am li:first-child'
                            )

                            if (!itemsFirstLi) {
                                // Если больше нет элементов, удаляем "Ещё"
                                liMore.remove()
                                liClean.remove()
                                flagMoreCreated = false
                                openListneer = false
                                break
                            }
                        } else {
                            break // Элемент не помещается - выходим
                        }
                    }

                    if (processedAny) {
                        resetVariables()
                    }
                }
                // работа при ресайзе
                function handleResize(entries) {
                    for (let entry of entries) {
                        const currentWidth = entry.contentRect.width

                        if (currentWidth > previousWidth && flagMoreCreated) {
                            // Окно увеличилось и есть элементы в "Ещё" - пытаемся вернуть их
                            disassemblyMenu()
                        } else if (currentWidth < previousWidth) {
                            // Окно уменьшилось - проверяем, нужно ли убрать элементы в "Ещё"
                            buildMenu()
                        }

                        previousWidth = currentWidth
                    }
                }

                // Создаем ResizeObserver для отслеживания изменений размера меню
                const resizeObserver = new ResizeObserver(handleResize)
                resizeObserver.observe(ul)

                // Инициализация при загрузке
                initAppointDropdown()
                buildMenu()
                    // показываем все элементы после отработки скрипта
                ul.classList.add("dsvc-ready");
                //document.querySelector('.wrap-block-2').classList.add("dsvc-wrap-ready");
                // document.querySelector('.wrap-block-3').classList.add("dsvc-wrap-ready");
            })
        })
    },
};

document.addEventListener('DOMContentLoaded', () => {
    MV.activeMenu();
});