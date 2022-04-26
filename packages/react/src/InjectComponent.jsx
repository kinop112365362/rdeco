/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from 'react'
import { inject, req } from '@rdeco/module'

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
export function ReqComponent(props) {
  const [time, setTime] = useState(0)
  let Component = useRef(() => <></>)
  useEffect(() => {
    if (
      window.$$rdeco_combination.reactComponents &&
      window.$$rdeco_combination.reactComponents[props.name]
    ) {
      Component.current = window.$$rdeco_combination.reactComponents[props.name]
      setTime(1)
    } else {
      let remoteReqName = props.name
      if (props.autoEntry) {
        remoteReqName = `${props.name}/req-entry`
      }
      const remote = req(remoteReqName)
      remote
        .getComponent()
        .then((com) => {
          Component.current = com
          setTime(1)
        })
        .catch((e) => {
          console.warn(e)
        })
    }
  }, [])
  return (
    <>
      <Component.current time={time} {...props}></Component.current>
    </>
  )
}
