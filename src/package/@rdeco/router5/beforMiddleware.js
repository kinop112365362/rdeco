import { notify } from '../core'

export const beforeDoneMiddleware = (beforeDone) => {
  return () => (toState, fromState, done) => {
    if (beforeDone) {
      beforeDone(toState, fromState, done)
    } else {
      done && done()
    }
  }
}

export const beforMiddleware = () => (toState, fromState, done) => {
  notify('@@router', 'before', { toState, fromState, done }).then((done) => {
    done && done()
  })
}
