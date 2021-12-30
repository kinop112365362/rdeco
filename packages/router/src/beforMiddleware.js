import { invoke } from '@rdeco/core'
import { handleRoute } from './utils'

export const beforeDoneMiddleware = (beforeDone) => {
  return () => (toState, fromState, done) => {
    toState = handleRoute(toState)
    if (beforeDone) {
      beforeDone(toState, fromState, done)
    } else {
      done && done()
    }
  }
}

export const beforMiddleware = () => (toState, fromState, done) => {
  invoke('@@router', 'before', { toState, fromState, done }).then((done) => {
    done && done()
  })
}
