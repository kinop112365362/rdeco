import React, { useContext } from 'react'
import { createComponent } from '../react'
import RouterContext from './RouterContext'
import { getPath, handlePath } from './utils'

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

      let isMatch =
        path === '/' ||
        currentPath === toStatePath ||
        (toStatePath.indexOf(path) === 0 && toStatePath[path.length] === '/')

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
      const context = useContext(RouterContext) || { parentPath: '' }
      const parentPath = context.parentPath
      const currentPath = getPath(context.parentPath, path)
      const active = this.state.active

      this.ref.parentPath = parentPath

      return (
        <RouterContext.Provider
          value={{
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
