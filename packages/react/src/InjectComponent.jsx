/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from 'react'
import { inject, req } from '@rdeco/module'
import { createMembrane, create } from '@rdeco/core'

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
  const [render, setRender] = useState(false)
  let Component = useRef(() => <></>)
  useEffect(() => {
    inject(props.name)
      .getComponent()
      .then((com) => {
        Component.current = com
        setRender(true)
      })
      .catch((e) => {
        console.warn(e)
      })
  }, [])
  if (props.componentProps) {
    return (
      <>
        {render && (
          <Component.current {...props.componentProps}></Component.current>
        )}
      </>
    )
  }
  return <>{render && <Component.current {...props}></Component.current>}</>
}

export function ReqApp(props) {
  const {
    membrane,
    onIframeLoad = (setDisplay) => {
      setDisplay('block')
    },
    style,
    src,
    configName,
  } = props
  const [display, setDisplay] = useState('none')
  useEffect(async () => {
    const baseConfig = await inject(configName).getBaseConfig()
    create(createMembrane(baseConfig, membrane))
  }, [])
  return (
    <div>
      <div style={{ display }}>
        <iframe
          onLoad={onIframeLoad(setDisplay)}
          style={style || {}}
          title="req-app"
          src={src}
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  )
}

export function ReqComponent(props) {
  const [render, setRender] = useState(false)
  const [loaded, setLoaded] = useState(false)
  let Component = useRef(() => <></>)
  const done = () => {
    if (props.done) {
      props.done()
    }
    setLoaded(true)
    setRender(true)
    return
  }
  const renderComponent = () => {
    if (props.componentProps) {
      return (
        <>
          {render && (
            <Component.current {...props.componentProps}></Component.current>
          )}
        </>
      )
    }
    return <>{render && <Component.current {...props}></Component.current>}</>
  }
  useEffect(() => {
    if (
      window.$$rdeco_combination.reactComponents &&
      window.$$rdeco_combination.reactComponents[props.name]
    ) {
      Component.current = window.$$rdeco_combination.reactComponents[props.name]
      done()
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
          done()
        })
        .catch((e) => {
          setLoaded(true)
          console.warn(e)
        })
    }
  }, [])
  if (props.fallback) {
    if (loaded) {
      return renderComponent()
    }
    return <>{props.fallback}</>
  }
  return renderComponent()
}
