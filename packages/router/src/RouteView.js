import React, { useContext, useEffect, useState } from 'react'
import { createComponent } from '@rdeco/react'
import RouterContext from './RouterContext'
import { getPath, handlePath, pathToName, matchPath, matchName } from './utils'

/**
 * @param {String} props.path
 * @param {ReactDOM} props.Component
 */
const RouteView = createComponent({
  name: '@rdeco/router5-route-view',
  state: {
    active: false,
  },
  ref: {
    parentPath: '',
  },
  router: {
    before({ toState, fromState = {}, done }, next) {
      console.log(toState, fromState)
      const parentPath = this.ref.parentPath
      const path = handlePath(this.props.path || '/')
      const toStatePath = handlePath(toState.path)
      const currentPath = getPath(parentPath, path)
      const toStateParams = toState?.params || {}
      const fromStateParams = fromState?.params || {}

      const isMatch = matchPath(currentPath, toStatePath)
      if (
        isMatch !== this.state.active ||
        JSON.stringify(toStateParams) !== JSON.stringify(fromStateParams)
      ) {
        if (isMatch) {
          setTimeout(() => {
            this.setter.active(isMatch)
          }, 0)
        } else {
          this.setter.active(isMatch)
        }
      }

      if (isMatch) {
        next(done)
      }
    },
  },
  view: {
    render() {
      const [isShow, setIsShow] = useState(false)
      const { Component, path, noPrefixSlash } = this.props
      const routerContext = useContext(RouterContext) || { parentPath: '' }
      const parentPath = routerContext.parentPath
      let currentPath = getPath(routerContext.parentPath, path)
      const routeName = pathToName(currentPath)
      if (noPrefixSlash && currentPath.length > 1 && currentPath[0] === '/') {
        currentPath = currentPath.substr(1)
      }
      const active = this.state.active

      this.ref.parentPath = parentPath

      // UNKNOWN_ROUTE
      if (
        !this.context.router.matchPath(currentPath) &&
        !matchName(routeName, this.context.router)
      ) {
        // add router
        this.context.router.add({
          name: routeName,
          path: currentPath,
        })
      }

      useEffect(() => {
        setIsShow(active)
      }, [active])

      return (
        <RouterContext.Provider
          value={{
            router: this.context.router,
            parentPath: currentPath,
          }}
        >
          {isShow && Component && <Component />}
          {isShow && this.props.children}
        </RouterContext.Provider>
      )
    },
  },
})

const Router = createComponent({
  name: '@rdeco/router5-router',
  view: {
    render() {
      return (
        <RouteView path={this.props.path || ''}>
          {this.props.children}
        </RouteView>
      )
    },
  },
})

export { Router, RouteView }
