import React from 'react'
const Contexts = {}

export function registerReactContext(key, context = {}) {
  if (Contexts[key]) {
    throw new Error(`${key} Context 已经被注册了`)
  }
  Contexts[key] = React.createContext(context)
  return Contexts[key]
}

export function getContext(key) {
  if (!Contexts[key]) {
    throw new Error(`${key} Context 还未注册`)
  }
  return Contexts[key]
}
