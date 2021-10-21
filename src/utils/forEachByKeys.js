/* eslint-disable no-undef */
export const forEachByKeys = (object, handle) => {
  Object.keys(object).forEach((...args) => {
    handle(...args)
  })
}

export const initObject = (object, type) => {
  if (!object) {
    object = type
  }
  return object
}
