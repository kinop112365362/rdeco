/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { inject } from '@rdeco/module'

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

export function InjectComponent(props) {
  const [component, setComponent] = useState(null)
  useEffect(() => {
    inject(props.name)
      .getComponent()
      .then((com) => {
        setComponent(React.createElement(com, props))
      })
  }, [props])
  return <div>{component}</div>
}
