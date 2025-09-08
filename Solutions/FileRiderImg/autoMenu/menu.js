var MV = {
    activeMenu: function() {    
        document.querySelectorAll('.menu-wrapper').forEach(el => {
            let ul = el.querySelector('ul');
            let flagMore = false;

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

            function openDrop() {
                let heightMore = liMore.getBoundingClientRect().height;
                liMore.style.setProperty('--height-more', heightMore);
                liMore.addEventListener('mouseover', function() {
                    if (!liMore.classList.contains('open')) {
                        liMore.classList.add('open');
                    }
                });
                
            }

            function checkMenu() {
                let ulBound = ul.getBoundingClientRect()
                let itemsLi = el.querySelectorAll('ul li:not(.more)');  
                let lastLi = itemsLi.length > 0 ? itemsLi[itemsLi.length - 1] : null; 
                let liBound =  lastLi.getBoundingClientRect();

                if (ulBound.right <= liBound.right) {
                    if (!flagMore) {
                        ul.append(liClean,liMore);
                        flagMore = true;
                    }
                    ulDrop.insertAdjacentElement('afterbegin', lastLi);
                }
            }
            
            window.addEventListener('resize', () => {
                checkMenu();
            });
            
            checkMenu();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    MV.activeMenu();
    
});