/* eslint-disable no-undef */
import { AsyncSubject } from 'rxjs'
import { combination } from '../store/combination'

export const notify = (...args) => {
  const syncker = new AsyncSubject(null)
  const next = (value) => {
    syncker.next(value)
    syncker.complete()
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
  if (/^@@/.test(args[0])) {
    const { beforeNotify, subject } = combination.extends[args[0]]
    subject.next(beforeNotify(args[1], args[2], next))
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
