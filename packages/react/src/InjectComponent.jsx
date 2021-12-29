/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { inject } from '@rdeco/module/src'

export function Inject(props) {
  const el = React.createRef()
  let deps = []
  if (props.deps) {
    deps = props.deps.map((dep) => {
      if (Array.isArray(props[dep])) {
        return JSON.stringify(props[dep])
      } else {
        return props[dep]
      }
    })
  }
  useEffect(() => {
    inject(props.name).render(el.current, props)
  }, deps)
  return <div ref={el}></div>
}
