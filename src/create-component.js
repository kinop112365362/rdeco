/* eslint-disable react/prop-types */
import React from 'react'
import { createStore } from './create-store'

export function enhanceCreateComponent(enhances) {
  return function createComponent(component) {
    const copy = { ...component }
    return function HookComponent(props) {
      if (props.sid) {
        copy.sid = props.sid
      }
      const useComponent = createStore(copy, enhances)
      const store = useComponent(props)
      let isRender = true
      if (props.if === false) {
        isRender = false
      }
      if (props.foreach) {
        return (
          <>
            {isRender &&
              props.foreach.list.map((l) => {
                return React.createElement(HookComponent, {
                  key: l[props.foreach.keyName],
                  sid: l[props.foreach.keyName],
                  ...l,
                })
              })}
          </>
        )
      }
      return <>{isRender && store.view.render()}</>
    }
  }
}

export const createComponent = enhanceCreateComponent([])
