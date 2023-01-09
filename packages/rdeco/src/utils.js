import { combination } from '@rdeco/core'

export function getIframeWindow(iframeName) {
  return combination.iframeRef[iframeName].contentWindow.rdeco
}

export function topInject(moduleName) {
  return window.top.rdeco.inject(moduleName)
}
