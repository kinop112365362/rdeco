import React from 'react'
import { createStore } from './create-store'

export function createComponent(component, membrane = {}) {
  component.membrane = membrane
  return function HookComponent(props) {
    const useComponent = createStore(component)
    const store = useComponent(props)
    return <>{store.view.render()}</>
  }
}
