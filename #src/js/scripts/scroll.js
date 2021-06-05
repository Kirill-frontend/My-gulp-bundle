// Scroll

// Must have navItem data attribute scrollto (data-scrollto=".class")

const navItem = document.querySelectorAll('.header_nav_list li') // Links

navItem.forEach(item => {
  item.addEventListener('click', () => {
    scrollToElem(item.dataset.scrollto)    
  })
})

function scrollToElem(elem) {
  const element = document.querySelector(`.${elem}`)  
  const box = element.getBoundingClientRect()
  scrollTo({
    top: box.top + pageYOffset,
    behavior: 'smooth'
  })
}