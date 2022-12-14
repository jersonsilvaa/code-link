import { $, $$ } from './dom.js'
import { __, events } from '../events-controller.js'

import WindowPreviewer from './WindowPreviewer.js'

const $aside = $('aside')
const $buttons = $$('button', $aside)


const SIMPLE_CLICK_ACTIONS = {
  'download-source-code': () => {
    __.emit(events.DOWNLOAD_SOURCE_CODE)
  },
  'copy-url': async () => {
    await navigator.clipboard.writeText(window.location.href)
  }
}

const NON_SIMPLE_CLICK_ACTIONS = {
  'close-aside-bar': () => {
    $('.aside-bar').setAttribute('hidden', '')
  },

  'show-skypack-bar': () => {
    showAsideBar('#skypack')
    $('#skypack-search-input').focus()
  },

  'show-settings-bar': () => {
    showAsideBar('#settings')
  },

  'open-iframe-tab': () => {
    WindowPreviewer.openWindow()
  }
}

const showAsideBar = (selector) => {
  $('.aside-bar').removeAttribute('hidden')
  $$('.bar-content').forEach(el => el.setAttribute('hidden', ''))
  $(selector).removeAttribute('hidden')
}

const actions = {
  ...SIMPLE_CLICK_ACTIONS,
  ...NON_SIMPLE_CLICK_ACTIONS
}

$buttons.forEach(button => {
  button.addEventListener('click', ({ currentTarget }) => {
    let action = button.getAttribute('data-action')
    const isSimpleClickAction = button.getAttribute('data-is-simple-click-action') === 'true'

    if (isSimpleClickAction) return actions[action]()

    const alreadyActive = currentTarget.classList.contains('is-active')
    $('.is-active').classList.remove('is-active')

    action = alreadyActive
      ? 'close-aside-bar'
      : action

    const elementToActive = alreadyActive
      ? $("button[data-action='close-aside-bar']")
      : currentTarget
    elementToActive.classList.add('is-active')
    actions[action]()
  })
})