const tabListButtons = document.querySelector('.tab_list');
const tabButtons = tabListButtons.querySelectorAll('button');

const tabListContent = document.querySelector('.tab_list_content');
const tabContent = tabListContent.querySelectorAll('.tab_content');

let tab = 0

tabContent[0].style.opacity = '1'
tabContent[0].style.visibility = 'visible'


tabButtons.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (tabButtons[tab] == tabContent[tab]) {
            return false
        } else {
            tab = index
            tabContent.forEach(item => {
                item.style.opacity = '0'
                item.style.visibility = 'hidden'
            })
            tabContent[tab].style.opacity = '1'
            tabContent[tab].style.visibility = 'visible'
        }
    })
})
