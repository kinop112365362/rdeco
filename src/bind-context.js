/* eslint-disable react/display-name */
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { subject } from './subject'

export function bindContext(fnKeys, fnObj, context, instance, subjectKey) {
  if (!fnObj) {
    return {}
  }
  const fnObjBindContext = {}
  fnKeys.forEach((fnKey) => {
    fnObjBindContext[fnKey] = (...args) => {
      subject.next({
        eventName: `${instance.name}_${subjectKey}_${fnKey}`,
        data: {
          key: fnKey,
          args: args,
          name: instance.name,
          state: instance.state,
        },
      })
      return fnObj[fnKey].call(context, ...args)
    }
  })
  return fnObjBindContext
}
