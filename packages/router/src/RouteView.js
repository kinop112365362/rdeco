import React, { useContext } from 'react'
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
    before({ toState, done }, next) {
      const parentPath = this.ref.parentPath
      const path = handlePath(this.props.path || '/')
      const toStatePath = handlePath(toState.path)
      const currentPath = getPath(parentPath, path)

      const isMatch = matchPath(currentPath, toStatePath)
      if (isMatch !== this.state.active) {
        this.setter.active(isMatch)
      }

      if (isMatch) {
        next(done)
      }
    },
  },
  view: {
    render() {
      const { Component, path } = this.props
      const routerContext = useContext(RouterContext) || { parentPath: '' }
      const parentPath = routerContext.parentPath
      const currentPath = getPath(routerContext.parentPath, path)
      const routeName = pathToName(currentPath)
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

      return (
        <RouterContext.Provider
          value={{
            router: this.context.router,
            parentPath: currentPath,
          }}
        >
          {active && Component && <Component />}
          {active && this.props.children}
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
