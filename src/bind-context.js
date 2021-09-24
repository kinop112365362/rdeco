/* eslint-disable react/display-name */
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { subject } from './subject'

export function bindContext(fnKeys, fnObj, context, instance, isSubject) {
  if (!fnObj) {
    return {}
  }
  const fnObjBindContext = {}
  fnKeys.forEach((fnKey) => {
    fnObjBindContext[fnKey] = (...args) => {
      if (isSubject) {
        subject.next({
          eventName: `${instance.name}_controller_${fnKeys}`,
          data: {
            args: [...args],
            instance,
          },
        })
      }
      return fnObj[fnKey].call(context, ...args)
    }
  })
  return fnObjBindContext
}
