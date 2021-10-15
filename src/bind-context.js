/* eslint-disable react/display-name */
import { viewSubject, controllerSubject, serviceSubject } from './subject'
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
          ? `${instance.name.split('_')[0]}:sid`
          : instance.name.split('_')[0],
        subjectKey,
        fnKey,
        sid: instance.props.sid,
      }
      switch (subjectKey) {
        case 'view':
          viewSubject.next({
            eventTargetMeta,
            data,
          })
          break
        case 'controller':
          controllerSubject.next({
            eventTargetMeta,
            data,
          })
          break
        case 'service':
          serviceSubject.next({
            eventTargetMeta,
            data,
          })
          break
        default:
          break
      }
      return fnObj[fnKey].call(
        { ...combination.enhanceContext, ...context },
        ...args
      )
    }
  })
  return fnObjBindContext
}
