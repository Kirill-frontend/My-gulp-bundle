
function _createContentSlick(options) {
    const parentNode = document.querySelector(options.position);
    parentNode.insertAdjacentHTML('afterbegin', `
    <div class="content_slick" style="width:${options.width || '300px'}" data-id="${options.id}">
    <div class="slick_col">
        <div class="slick_border" style="height:${options.height ||'100px'}">
        ${options.arrows ? `<button class="arrow" data-left="left">&larr;</button>` : ' '}
            <div class="slick_body">
          
            </div>
        ${options.arrows ? `<button class="arrow" data-right="right">&rarr;</button>` : ' '}
        </div>
    </div>
    <div class="slick_col">
    <div class="dots_flex">
    </div>
    </div>
    </div>
    `)

    let slick_body = parentNode.querySelector('.slick_body');
    if (options.items.length > 0 ) {        
        options.items.forEach(i => {
            slick_body.insertAdjacentHTML ("beforeend",`
                <div class="slick_item" data-slide="${i.slide}">
                   <div class="slick_content">${i.content}</div>
                </div>
            `)
        })
    } else {
        slick_body.innerText = 'Nothing'
    }
    
    if (options.items.length > 0 && options.dots) {
        const dots_flex = parentNode.querySelector('.dots_flex');

        options.items.forEach(i => {
            dots_flex.insertAdjacentHTML('beforeend',`<div class="dots" data-dots="${i.slide}"></div>`)
        })

        parentNode.querySelector('.dots').classList.add('active');

    }
    
    let slide = 0
    let slickList = parentNode.querySelectorAll('.slick_item');
    slickList[slide].style.display = 'block'
    slickList[slide].style.opacity = '1'
    const maxItems = slickList.length - 1
      
   const listener = event => {
      if (event.target.dataset.right) {
          if (slide !== maxItems) {
            slide++
            _contentAnimate()
            _dotsListener()
          } else {
              slide = 0
              _contentAnimate()
                _dotsListener()
          }  
      }

      if (event.target.dataset.left) {
          if (slide == 0) {
              slide = maxItems
              _contentAnimate()
                _dotsListener()
          } else {
              slide--
              _contentAnimate()
                _dotsListener()
    
          }
      }

      const dotsAll = parentNode.querySelectorAll('.dots');
      if (event.target.dataset.dots) {
        const thisDots = +event.target.dataset.dots - 1
            if (thisDots == slide) {
                return false
            } else {
            dotsAll.forEach(i => {
                i.classList.remove('active')
            })
            event.target.classList.add('active')
            slide = thisDots
                _contentAnimate()
                _dotsListener()
                
            }
      }

     
    }
    
    parentNode.addEventListener('click', listener)

    function _infinitySlides(options) {
        if (slide !== maxItems) {
            slide++
            _contentAnimate()
            _dotsListener()
          } else {
              slide = 0
              _contentAnimate()
                _dotsListener()
          } 
    }

    if (options.infinity) {
        setInterval(() => {
            _infinitySlides()
        }, options.infinityInterval || 5000);
    }

    function _dotsListener(e) {
        const dotsAll = parentNode.querySelectorAll('.dots');
        dotsAll.forEach(i => {
            i.classList.remove('active')
        })
        dotsAll[slide].classList.add('active')
    }

    function _contentAnimate() {
    let slickList = parentNode.querySelectorAll('.slick_item');
        slickList.forEach(item => {
            item.style.display = 'block'
            item.style.position = 'absolute'
            item.style.opacity = '0'
            })
            setTimeout(() => {
                slickList[slide].style.position = 'relative'
                slickList[slide].style.opacity = '1'
        },500)  
      }

   return parentNode
}



function contentSlick(options) {
        _createContentSlick(options)
}


// infinity +