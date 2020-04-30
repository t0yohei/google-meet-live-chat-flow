import { defaultState } from './store'
import storage from './utils/storage'
import logger from './utils/logger'

logger.log('content script loaded')

let observer
let state
let data = []

const loadState = async () => {
  const items = await storage.get('vuex')
  try {
    state = {
      ...defaultState,
      ...JSON.parse(items['vuex'])
    }
  } catch (e) {
    state = defaultState
  }
}

const flow = (node) => {
  if (!state.enabled) {
    return
  }

  const senderElement = node.querySelectorAll('div:nth-child(2)')[1]
  const messageElement = node.querySelector('div:nth-child(3)')
  if (!senderElement || !messageElement) {
    return
  }

  const sender = senderElement.innerText
  const message = messageElement.innerText

  const doc = (parent || window).document

  const container = doc.querySelector('[jsname=qJTHM]')
  const rows = state.rows
  const height = container.offsetHeight / rows
  const fontSize = height * 0.8

  const senderDiv = doc.createElement('div')
  const messageDiv = doc.createElement('div')

  messageDiv.innerHTML = message
  messageDiv.setAttribute('style', `
    position: absolute;
    padding-top: ${fontSize / 2}px;
    left: 5px;
    white-space: nowrap;
    display: inline-block;
    font-size: ${fontSize}px;
    font-weight: bold;
    color: ${state.color};
    text-shadow: ${state.textShadow};
  `)

  senderDiv.innerHTML = sender
  senderDiv.setAttribute('style', `
    font-size: ${fontSize / 2}px;
    position: absolute;
    color: silver;
    top: 0;
  `)

  container.appendChild(messageDiv)
  messageDiv.appendChild(senderDiv)

  const width = container.offsetWidth
  const commentWidth = messageDiv.offsetWidth
  const millis = state.speed * 1000

  const now = Date.now()

  const comment = {
    width: commentWidth,
    time: now
  }
  const vc = (width + commentWidth) / millis

  let index = data.findIndex((comments) => {
    const comment = comments[comments.length - 1]
    if (!comment) {
      return true
    }
    const vt = (width + comment.width) / millis

    const t1 = now - comment.time
    const d1 = vt * t1
    if (d1 < comment.width) {
      return false
    }

    const t2 = t1 + width / vc
    const d2 = vt * t2
    if (d2 < width + comment.width) {
      return false
    }

    return true
  })

  if (index === -1) {
    data.push([comment])
    index = data.length - 1
  } else {
    data[index].push(comment)
  }

  const top = (height * (index % rows))
  const depth = Math.floor(index / rows)
  const opacity = 1 - 0.2 * depth

  messageDiv.setAttribute('style', messageDiv.getAttribute('style') + `
    top: ${top}px;
    opacity: ${opacity};
  `)

  const keyframes = [
    { transform: `translate(${width}px, 0px)` },
    { transform: `translate(-${commentWidth}px, 0px)` }
  ]

  const animation = messageDiv.animate(keyframes, millis)
  animation.onfinish = () => {
    messageDiv.parentNode.removeChild(messageDiv)
    data[index].shift()
  }
}

const initialize = async () => {
  logger.log('initialize')

  const commentList = document.querySelector('[jscontroller=ENYfP]')

  if (commentList === null) {
    return
  }

  if (observer) {
    observer.disconnect()
  }

  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const nodes = Array.from(mutation.addedNodes)
      if (nodes.length > 50) {
        return
      }
      nodes.forEach((node) => {
        flow(node)
        node.style.display = 'none'
      })
    })
  })
  observer.observe(commentList, { childList: true })
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  logger.log('onMessage: %o', message)
  const { id, data } = message
  switch (id) {
    case 'urlChanged':
      initialize(data.url)
      break
    case 'stateChanged':
      await loadState()
      break
  }
})

const initialObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    const addedNode = Array.from(mutation.addedNodes)[0]
    if (
      addedNode !== undefined &&
      addedNode.tagName === 'DIV' &&
      addedNode.hasAttribute('jscontroller') &&
      addedNode.getAttribute('jscontroller') === 'aSjf3c'
    ) {
      (async () => {
        await loadState()
        initialize(location.href)
      })()
    }
  })
})

const config = { attributes: true, childList: true, characterData: true }
initialObserver.observe(document.querySelector('[jsname="RFn3Rd"]'), config)
