/* eslint-disable react/display-name */
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { subject } from './subject'

export function bindContext(fnKeys, fnObj, context, instance, isNeedSubject) {
  if (!fnObj) {
    return {}
  }
  const fnObjBindContext = {}
  fnKeys.forEach((fnKey) => {
    fnObjBindContext[fnKey] = (...args) => {
      if (isNeedSubject) {
        subject.next({
          eventName: `${instance.name}_controller_${fnKey}`,
          data: {
            key: fnKey,
            args: args,
            instance,
          },
        })
      }
      return fnObj[fnKey].call(context, ...args)
    }
  })
  return fnObjBindContext
}
