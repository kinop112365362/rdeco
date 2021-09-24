/* eslint-disable react/display-name */
// eslint-disable-next-line no-unused-vars
import React from 'react'

export function bindContext(fnKeys, fnObj, context) {
  if (!fnObj) {
    return {}
  }
  const fnObjBindContext = {}
  fnKeys.forEach((fnKey) => {
    fnObjBindContext[fnKey] = (...args) => {
      return fnObj[fnKey].call(context, ...args)
    }
  })
  return fnObjBindContext
}
