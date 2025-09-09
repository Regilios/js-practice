var MV = {
    activeMenu: function() {
        document.querySelectorAll('.dsvc-automenu').forEach((el) => {
            // ------------------- created elements -------------------
            let ul = el.querySelector('ul')
            let flagMoreCreated = false
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

            // ------------------- helpers -------------------
            function openDrop() {
                let heightMore = liMore.getBoundingClientRect().height
                liMore.style.setProperty('--height-more', heightMore)
                liMore.addEventListener('mouseover', function() {
                    if (!liMore.classList.contains('open')) {
                        liMore.classList.add('open')
                    }
                })
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
            let itemsWidthFirstLi = null;
            let itemsFirstLi = null;
            let widthLiClean = null;
            let widthliInner = null;
            let pLeft = null;
            let pRight = null;
            let listLiUpdated = null;
            let positionAppend = 0;
            let listLi = null;
            let ulBound = 0;
            let widthMore = 0 // длина more

            function checkWidthMenu() {
                if (!listLi) {
                    listLi = getList()
                }

                if (!pLeft && !pRight) {
                    pLeft = parseInt(getComputedStyle(listLi[0]).paddingLeft)
                    pRight = parseInt(getComputedStyle(listLi[0]).paddingRight)
                }

                ulBound = ul.getBoundingClientRect().right //позиция ul

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

                        itemsFirstLi = null
                        itemsWidthFirstLi = null
                    }
                });
                listLi = null
            }

            function resizeMenu() {
                if (!itemsFirstLi) {
                    itemsFirstLi = ul.querySelector('ul.more-drop li:first-child');
                }
                if (itemsFirstLi === null || itemsFirstLi === undefined) {
                    checkWidthMenu()
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
                        }

                        positionAppend = 0;
                        listLiUpdated = null;
                        itemsFirstLi = null;
                        itemsWidthFirstLi = null;
                        listLi = null;
                        pLeft = null;
                        pRight = null;
                    } else {
                        checkWidthMenu()
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

            window.addEventListener('resize', debounce(resizeMenu, 10));
            checkWidthMenu()
        })
    },
}

document.addEventListener('DOMContentLoaded', () => {
    MV.activeMenu()
})