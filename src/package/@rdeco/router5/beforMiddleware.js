import { notify } from '../core'

export const beforMiddleware = () => (toState, fromState, done) => {
  notify('@@router', 'before', { toState, fromState, done }).then((done) => {
    done && done()
  })
}
