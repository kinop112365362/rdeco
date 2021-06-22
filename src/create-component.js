/* eslint-disable react/prop-types */
import React from 'react'
import { createStore } from './create-store'

export function enhanceCreateComponent(enhances) {
  return function createComponent(component, membrane = {}) {
    const copy = { ...component }
    copy.membrane = membrane
    return function HookComponent(props) {
      const useComponent = createStore(copy, enhances)
      const store = useComponent(props)
      if (props.sRef) {
        props.sRef = store
      }
      return <>{store.view.render()}</>
    }
  }
}

export const createComponent = enhanceCreateComponent([])
