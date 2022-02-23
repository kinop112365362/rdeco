/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { inject } from '@rdeco/module'
import { useRef } from 'react'

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
  const [time, setTime] = useState(0)
  let Component = useRef(() => <></>)
  useEffect(() => {
    inject(props.name)
      .getComponent()
      .then((com) => {
        Component.current = com
        setTime(1)
      })
      .catch((e) => {
        console.warn(e)
      })
  }, [])
  return (
    <>
      <Component.current time={time} {...props}></Component.current>
    </>
  )
}
