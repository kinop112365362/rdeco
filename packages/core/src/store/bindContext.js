/* eslint-disable react/display-name */
import { combination } from './combination'

export function bindContext(fnKeys, fnObj, context, ins, subjectKey) {
  if (!fnObj) {
    return {}
  }
  const fnObjBindContext = {}
  fnKeys.forEach((fnKey) => {
    fnObjBindContext[fnKey] = (...args) => {
      if (subjectKey !== 'view') {
        const data = {
          key: fnKey,
          args: args,
          state: ins.state,
        }
        const eventTargetMeta = {
          subjectKey,
          fnKey,
        }
        const value = {
          eventTargetMeta,
          data,
        }
        const source = fnObj[fnKey]
        combination.$broadcast(ins, value, subjectKey, source)
      }
      return fnObj[fnKey].call(
        { ...combination.enhanceContext, ...context },
        ...args
      )
    }
    Object.defineProperty(fnObjBindContext[fnKey], 'name', {
      value: `${fnKey}BindContext`,
    })
  })
  return fnObjBindContext
}
