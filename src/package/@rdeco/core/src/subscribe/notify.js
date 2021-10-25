/* eslint-disable no-undef */
import { AsyncSubject } from 'rxjs'
import { combination } from '../store/combination'

export const notify = (...args) => {
  const syncker = new AsyncSubject(null)
  const next = (value) => {
    syncker.next(value)
    syncker.complete()
    syncker.unsubscribe()
  }
  const infrom = (target, fnKey, data, next) => {
    combination.$connectProxySubjectAsync(target, (targetProxy) => {
      targetProxy.subject.next({
        fnKey,
        data,
        next,
      })
    })
  }
  if (args[0][0] === '@@router') {
    combination.$routerBroadcast(args[0][1], args[0][2], next)
  } else {
    infrom(...args, next)
  }
  return new Promise((resolve) => {
    syncker.subscribe({
      next(value) {
        resolve(value)
      },
    })
  })
}
