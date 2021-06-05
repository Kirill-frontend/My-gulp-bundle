Element.prototype.appendAfter = function(element) {
    element.parentNode.insertBefore(this, element.nextSibling)
}

function noop() {}

function _createModalFooter(buttons = []) {
    if (buttons.length === 0) {
        return document.createElement('div')
    }
     
     const wrap = document.createElement('div') 
     wrap.classList.add('modal_footer')

     buttons.forEach(btn => {
         const $btn = document.createElement('button')
         $btn.textContent = btn.text
         $btn.classList.add('btn')
        //  $btn.setAttribute('data-btn', true)
         $btn.classList.add(`btn-${btn.type || 'secondary '}`)
         $btn.onclick = btn.handler || noop()
         wrap.appendChild($btn)
     })

     return wrap
}


function _createModal(options) {
    const default_width = '200px'
    const modal = document.createElement('div')
    modal.classList.add('vmodal')
    modal.insertAdjacentHTML('afterbegin', `
    <div class="modal_overlay" data-close="true">
        <div class="modal_window" style="width:${options.width || default_width}">
            <div class="modal_head">
                <span class="modal_title">${options.title || 'Window'}</span>
                ${options.closable ? `<span class="modal_close" data-close="true">&times;</span>` : ''}
            </div>
            <div class="modal_body" data-content>
                ${options.content || ''}
            </div> 
         
        </div>
    </div>
    `)

     const footer = _createModalFooter(options.footerButtons)
     footer.appendAfter(modal.querySelector('[data-content]'))
    document.body.append(modal)
    

    return modal

}



// animate.css

$.modal = function(options) {
    const ANIMATION_SPEED = 200
    let $modal = _createModal(options)
    let closing = false
    let destroyed = false 
    const modal = {
        open() {
            if (destroyed) {
                return console.log('modal is destroyed');
            }
            if (!closing) {
             $modal.classList.add('open')
            }
        },
        close() {
            closing = true
            $modal.classList.remove('open')
            $modal.classList.add('hide')
            setTimeout(() => {
                $modal.classList.remove('hide')
                closing = false
                if (typeof options.onClose === 'function') {
                    options.onClose()
                }
            }, ANIMATION_SPEED)
        }
    }

    const listener = event => {
        if (event.target.dataset.close) {
            modal.close()
        } 
    }

    $modal.addEventListener('click', listener)

    return Object.assign(modal, {
        destroy() {
            $modal.parentNode.removeChild($modal)
            $modal.removeEventListener('click', listener)
            destroyed = true
        },
        setContent(html) {
            $modal.querySelector('[data-content]').innerHTML = html
        },
        log() {
            console.log("console log");
        }
    })
}

// title, closable, width, footerButton(Array)[{text, type, handler}]

