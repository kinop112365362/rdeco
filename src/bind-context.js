/* eslint-disable react/display-name */
// eslint-disable-next-line no-unused-vars
import React from 'react'

export function bindContext(fnKeys, fnObj, context, hook = null) {
  if (!fnObj) {
    return {}
  }
  const fnObjBindContext = {}
  fnKeys.forEach((fnKey) => {
    fnObjBindContext[fnKey] = (...args) => {
      if (hook) {
        return hook.call(
          context,
          (...args) => fnObj[fnKey].call(context, ...args),
          fnKey,
          ...args
        )
      }
      return fnObj[fnKey].call(context, ...args)
    }
  })
  return fnObjBindContext
}
