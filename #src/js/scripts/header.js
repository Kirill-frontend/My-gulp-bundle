const header = document.querySelector('header')

document.addEventListener('scroll', function(e) {
  let scrollCount = self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop)
  
  if (scrollCount > header.clientHeight) {
    header.classList.add('_header-colored')
  } else {
    header.classList.remove('_header-colored')    
  }
})