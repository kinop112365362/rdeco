/* eslint-disable no-undef */
import { AsyncSubject } from 'rxjs'
import { combination } from '../store/combination'

export const invoke = (...args) => {
  const syncker = new AsyncSubject(null)
  const next = (value) => {
    syncker.next(value)
    syncker.complete()
  }
  const infrom = (targetMeta, fnKey, data, next) => {
    if (!Array.isArray(targetMeta)) {
      throw new Error(`${targetMeta} 不是一个数组`)
    }
    const [target, finder] = targetMeta
    if (combination.notificationSubjects[target]) {
      combination.notificationSubjects[target].next({
        fnKey,
        data,
        next,
        finder,
      })
    } else {
      combination.$createNotificationSubject({ register: true }, target).next({
        fnKey,
        data,
        next,
        finder,
      })
    }
  }
  if (/^@@/.test(args[0])) {
    const { beforeNotify, subject } = combination.extends[args[0]]
    subject.next(beforeNotify(args[1], args[2], next))
  } else {
    infrom(...args, next)
  }
  return new Promise((resolve, reject) => {
    syncker.subscribe({
      next(value) {
        if (value instanceof Error) {
          reject(value)
        } else {
          resolve(value)
        }
      },
    })
  })
}
