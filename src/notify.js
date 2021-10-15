import { combination } from './combination'

export const notify = (...args) => {
  const infrom = ([target, fnKey, data]) => {
    combination.$connectAsync(target, (targetInstance) => {
      targetInstance.subject.next({
        fnKey,
        data,
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
    infrom(...args)
  }
}
