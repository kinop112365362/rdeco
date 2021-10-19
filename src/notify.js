import { AsyncSubject } from 'rxjs'
import { combination } from './combination'

export const notify = (...args) => {
  const infrom = ([target, fnKey, data, syncker]) => {
    combination.$connectAsync(target, () => {
      combination.proxySubjects[target].next({
        fnKey,
        data,
        syncker,
      })
    })
  }
  if (args.length > 1) {
    if (args && args?.length > 0) {
      args.forEach((arg) => {
        infrom(arg)
      })
    }
  } else {
    if (args[0][0] === '@@router') {
      combination.$routerBroadcast(args[0][1], args[0][2])
    } else {
      infrom(...args)
    }
  }
}

export const syncNotify = ([target, subjectKey, value]) => {
  const syncker = new AsyncSubject('next')
  const next = (value) => {
    syncker.next(value)
    syncker.complete()
    syncker.unsubscribe()
  }
  notify([target, subjectKey, value, next])
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => {
    syncker.subscribe({
      next(value) {
        resolve(value)
      },
    })
  })
}
