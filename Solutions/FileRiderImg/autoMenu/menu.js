var MV = {
    activeMenu: function() {
        document.querySelectorAll('.dsvc-automenu').forEach((el) => {
            // ------------------- created elements -------------------
            let ul = el

            const liMore = document.createElement('li')
            liMore.className = 'more'
            const liClean = document.createElement('li')
            liClean.className = 'clean'
            const divMoreText = document.createElement('div')
            divMoreText.className = 'more-text'
            divMoreText.textContent = 'Ещё'
            const ulDrop = document.createElement('ul')
            ulDrop.className = 'more-drop'
            liMore.append(divMoreText, ulDrop)

            let flagMoreCreated = false // проверка создания more (ещё)
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
            let widthMore = 0 // ширина элемента more (ещё)
            let openListneer = false // проверка создания слушателя для more (ещё)

            // ------------------- helpers -------------------
            function openDrop(liMore, ulDrop) {
                let heightMore = liMore.getBoundingClientRect().height
                ulDrop.style.setProperty('--height-more', heightMore + 'px')

                liMore.addEventListener('mouseenter', function() {
                    if (!liMore.classList.contains('open')) {
                        liMore.classList.add('open')
                    }
                })
                liMore.addEventListener('mouseleave', function() {
                    removeOpenClass(liMore);
                })
                ulDrop.addEventListener('mouseleave', function() {
                    removeOpenClass(ulDrop);
                })

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
                element.classList.remove('inner')
                const wrapperDiv = element.querySelector('.wrapper');

                if (wrapperDiv) {
                    wrapperDiv.classList.remove('wrapper');
                    element.innerHTML = wrapperDiv.innerHTML;
                }
                return element
            }

            function getList() {
                return el.querySelectorAll('ul li:not(.more):not(.clean)')
            }

            // ------------------- main  -------------------
            function buildMenu() {
                if (!listLi) {
                    listLi = getList()
                }

                if (!pLeft && !pRight) {
                    pLeft = parseInt(getComputedStyle(listLi[0]).paddingLeft)
                    pRight = parseInt(getComputedStyle(listLi[0]).paddingRight)
                }

                ulBound = ul.getBoundingClientRect().right

                Array.from(listLi).reverse().forEach(element => {
                    let liBound = element.getBoundingClientRect().right

                    if (flagMoreCreated) {
                        widthMore = el.querySelector('.more').getBoundingClientRect().width
                        liBound = liBound + widthMore + 25 // +4 добавляе чтобы срабатывал чуть раньше чем коснётся ещё
                    }

                    if (ulBound <= liBound) {
                        if (!flagMoreCreated) {
                            ul.append(liClean, liMore)
                            flagMoreCreated = true
                        }
                        wrapContent(element)
                        ulDrop.prepend(element);

                        if (!openListneer) {
                            openDrop(liMore, ulDrop)
                            openListneer = true;
                        }

                        itemsFirstLi = null
                        itemsWidthFirstLi = null
                    }
                });
                listLi = null

            }

            function disassemblyMenu() {
                if (!itemsFirstLi) {
                    itemsFirstLi = ul.querySelector('ul.more-drop li:first-child');
                }
                if (itemsFirstLi === null || itemsFirstLi === undefined) {
                    buildMenu()
                } else {
                    itemsWidthFirstLi = itemsFirstLi.querySelector('.wrapper');
                    if (ulDrop.childNodes.length > 1) {
                        widthLiClean = liClean.getBoundingClientRect().width
                    } else {
                        widthLiClean = liClean.getBoundingClientRect().width + widthMore
                    }
                    widthliInner = pLeft + pRight + itemsWidthFirstLi.getBoundingClientRect().width

                    if (widthLiClean > widthliInner) {
                        unWrapContent(itemsFirstLi)
                        if (!listLiUpdated) {
                            listLiUpdated = ul.querySelectorAll('ul:not(li ul) > li')
                        }

                        positionAppend = listLiUpdated.length - 2;
                        ul.insertBefore(itemsFirstLi, listLiUpdated[positionAppend]);

                        if (ulDrop.childNodes.length == 0) {
                            liMore.remove();
                            liClean.remove();
                            flagMoreCreated = false;
                            openListneer = false;
                        }

                        positionAppend = 0;
                        listLiUpdated = null;
                        itemsFirstLi = null;
                        itemsWidthFirstLi = null;
                        listLi = null;
                        pLeft = null;
                        pRight = null;
                    } else {
                        buildMenu()
                    }
                }
            }

            function debounce(func, delay) {
                let timeout;
                return function(...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), delay);
                };
            }

            window.addEventListener('resize', debounce(disassemblyMenu, 50));
            buildMenu()
        })
    },
}

document.addEventListener('DOMContentLoaded', () => {
    MV.activeMenu()
})