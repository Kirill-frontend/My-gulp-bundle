function contentSlick() {

  const contentSliderSlides = document.querySelector('.content_slider_slides')
  const slides = contentSliderSlides.querySelectorAll('.content_slide')
  const buttons = document.querySelector('.slider_controls')
  
  const maxItems = slides.length - 1
  let slide = 0
  
  
  slides.forEach(item => {
    item.style.visibility = 'hidden'
    item.style.zIndex = '0'
  })
  
  slides[slide].style.visibility = 'visible'
  slides[slide].style.zIndex = '3'
  
  function doSlide() {
    slides.forEach(item => {        
      item.style.visibility = 'hidden'
      item.style.zIndex = '0'     
    })
    slides[slide].style.visibility = 'visible'
    slides[slide].style.zIndex = '3'
  
  }
  
  const listener = event => {     
    if (event.target.dataset.left) {            
     if (slide == 0) {        
         slide = maxItems
         doSlide()
     } else {        
         slide--
         doSlide()      
     }
  }
  
     if (event.target.dataset.right) {
         if (slide !== maxItems) {
         slide++
         doSlide()
         } else {
             slide = 0
             doSlide()
         }
  
     }
   }
  
  document.addEventListener('click', listener)
  }
  
  contentSlick()