// Burger
const burger = document.querySelector('.header_burger')
const burgerMenu = document.querySelector('.header_menu')

burger.addEventListener('click', () => {
  burger.classList.toggle('active')
  burgerMenu.classList.toggle('active')
  document.body.classList.toggle('lock')
})
