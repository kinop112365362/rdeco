/* eslint-disable react/prop-types */
import React from 'react'
import { createStore } from './create-store'

export function enhanceCreateComponent(enhances) {
  return function createComponent(component, membrane = {}) {
    const copy = { ...component }
    copy.membrane = membrane
    return function HookComponent(props) {
      if (props.sid) {
        copy.sid = props.sid
      }
      const useComponent = createStore(copy, enhances)
      const store = useComponent(props)
      return <>{store.view.render()}</>
    }
  }
}

export const createComponent = enhanceCreateComponent([])
