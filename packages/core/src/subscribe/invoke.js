/* eslint-disable no-undef */
import { AsyncSubject } from 'rxjs'
import { combination } from '../store/combination'

export const invoke = (...args) => {
  const syncker = new AsyncSubject(null)
  const next = (value) => {
    syncker.next(value)
    syncker.complete()
  }
  const error = (err) => {
    syncker.error(err)
  }
  const infrom = (targetMeta, fnKey, data, next, error) => {
    if (!Array.isArray(targetMeta)) {
      throw new Error(`${targetMeta} 不是一个数组`)
    }
    const [target, finder] = targetMeta
    const value = {
      type: 'invoke',
      targetMeta,
      fnKey,
      data,
    }
    combination.$record(value)
    if (combination.notificationSubjects[target]) {
      combination.notificationSubjects[target].next({
        fnKey,
        data,
        next,
        error,
        finder,
      })
    } else {
      combination.$createNotificationSubject({ exports: true }, target).next({
        fnKey,
        data,
        next,
        error,
        finder,
      })
    }
  }
  if (/^@@/.test(args[0])) {
    const { beforeNotify, subject } = combination.extends[args[0]]
    subject.next(beforeNotify(args[1], args[2], next, error))
  } else {
    infrom(...args, next, error)
  }
  return new Promise((resolve, reject) => {
    const [targetMeta, fnKey] = args
    syncker.subscribe({
      next(value) {
        const info = {
          type: 'invokeSucess',
          targetMeta,
          fnKey,
          result: value,
        }
        combination.$record(info)
        resolve(value)
      },
      error(e) {
        reject(e)
      },
    })
  })
}
