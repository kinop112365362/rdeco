/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from 'react'
import { inject, req } from '@rdeco/module'
import { createMembrane, create, combination } from '@rdeco/core'
import { createComponent } from './createComponent'
import { useCallback } from 'react'

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
  const { membrane, style, src, configName } = props
  const iframeRef = useRef()
  const onLoadCallback = useCallback(() => {
    if (membrane) {
      combination.iframeRef[configName] = iframeRef.current
      iframeRef.current.contentWindow.document.addEventListener(
        'DOMContentLoaded',
        () => {
          if (iframeRef.current.contentWindow.rdeco) {
            iframeRef.current.contentWindow.rdeco.create({
              name: configName,
              exports: {
                getAppMembrane(resolve) {
                  resolve(membrane)
                },
              },
            })
          } else {
            setTimeout(() => {
              iframeRef.current.contentWindow.rdeco.create({
                name: configName,
                exports: {
                  getAppMembrane(resolve) {
                    resolve(membrane)
                  },
                },
              })
            }, 5000)
          }
        }
      )
    }
  }, [membrane])
  return (
    <div>
      <div style={style}>
        <iframe
          ref={iframeRef}
          onLoad={onLoadCallback}
          style={style || {}}
          title="req-app"
          src={src}
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  )
}

export function installHooks(baseConfig, hookName) {
  function installHandle(membrane) {
    if (baseConfig.component) {
      const componentKeys = Object.keys(baseConfig.component)
      componentKeys.forEach((componentKey) => {
        let com = null
        if (combination.components[componentKey]) {
          delete combination.components[componentKey]
        }
        baseConfig.component[componentKey].name = componentKey + '-comp'
        if (membrane.component && membrane.component[componentKey]) {
          com = createComponent(
            createMembrane(
              baseConfig.component[componentKey],
              membrane.component[componentKey]
            )
          )
        } else {
          com = createComponent(baseConfig.component[componentKey])
        }
        create({
          name: componentKey,
          exports: {
            getComponent(resolve) {
              resolve(com)
            },
          },
        })
      })
    }
    if (baseConfig.function) {
      const keys = Object.keys(baseConfig.function)
      keys.forEach((key) => {
        if (combination.components[key]) {
          delete combination.components[key]
        }
        baseConfig.function[key].name = key
        if (membrane.function && membrane.function[key]) {
          create(
            createMembrane(baseConfig.function[key], membrane.function[key])
          )
        } else {
          create(baseConfig.function[key])
        }
      })
    }
  }
  if (self !== top) {
    inject(hookName)
      .getAppMembrane()
      .then((membrane) => {
        installHandle(membrane)
      })
  } else {
    installHandle({})
  }
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
