/* eslint-disable react/display-name */
import { combination } from './combination'

export function bindContext(fnKeys, fnObj, context, instance, subjectKey) {
  if (!fnObj) {
    return {}
  }
  const fnObjBindContext = {}
  fnKeys.forEach((fnKey) => {
    fnObjBindContext[fnKey] = (...args) => {
      const data = {
        key: fnKey,
        args: args,
        name: instance.name,
        state: instance.state,
      }
      const eventTargetMeta = {
        componentName: instance.props.sid
          ? instance.name.split('_')[0]
          : instance.name,
        subjectKey,
        fnKey,
        sid: instance.props.sid,
      }
      const value = {
        eventTargetMeta,
        data,
      }
      combination.$broadcast(instance.name, value, subjectKey)
      return fnObj[fnKey].call(
        { ...combination.enhanceContext, ...context },
        ...args
      )
    }
  })
  return fnObjBindContext
}
