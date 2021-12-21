/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from 'react'
import { AsyncSubject } from 'rxjs'
import { combination } from '../core'

export function createFallback(targetMeta, component) {
  const [baseSymbol, finder] = targetMeta
  let subscription = null
  if (combination.components[baseSymbol]) {
    if (finder) {
      subscription = combination.components[baseSymbol]
        .find(finder)
        .instance.subjects.fallback.subscribe({
          next({ done }) {
            done({ component, subscription })
          },
        })
    } else {
      subscription = combination.components[baseSymbol].forEach((com) => {
        com.instance.subjects.fallback.subscribe({
          next({ done }) {
            done({ component, subscription })
          },
        })
      })
    }
  } else {
    combination.registerSubject.subscribe({
      next(value) {
        if (value) {
          if (value.baseSymbol === baseSymbol) {
            if (finder && finder(value.instance.props)) {
              const subscription = value.instance.subjects.fallback.subscribe({
                next({ done }) {
                  done({ component, subscription })
                },
              })
            } else {
              const subscription = value.instance.subjects.fallback.subscribe({
                next({ done }) {
                  done({ component, subscription })
                },
              })
            }
          }
        }
      },
    })
  }
}

export function Fallback(props) {
  const [render, setRender] = useState(null)
  const Child = useRef(null)
  useEffect(() => {
    const asyncker = new AsyncSubject()
    const done = (value) => {
      asyncker.next(value)
      asyncker.complete()
    }
    const asynckerSubscription = asyncker.subscribe({
      next(value) {
        const { component } = value
        Child.current = React.createElement(component, props)
        setRender(new Date().getTime())
      },
    })
    props.store.subjects.fallback.next({ props, done })
    return () => {
      asynckerSubscription.unsubscribe()
    }
  }, [])
  return <>{render && Child.current}</>
}
