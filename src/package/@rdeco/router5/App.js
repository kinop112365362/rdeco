import React from 'react'
import ReactDOM from 'react-dom'
import createRouter from 'router5'
import browserPlugin from 'router5-plugin-browser'
// import loggerPlugin from 'router5-plugin-logger'
import { notify, enhanceContext } from '../core'
import { createComponent } from '../react'
import { beforMiddleware } from './beforMiddleware'

function pathToName(path) {
  return (path || '/').replace(/\//g, '_')
}

class App {
  constructor(config) {
    if (!config.Container) {
      throw new Error(
        'Container 未定义, config 内必须声明 Container 作为应用的容器组件'
      )
    }
    if (!config.router) {
      throw new Error('config.router 未定义')
    }
    this.router = createRouter(config.router, { allowNotFound: true })

    const _oldNavigate = this.router.navigate.bind(this)
    this.router.navigate = (...args) => {
      const pathName = args[0]
      const routeName = pathToName(pathName)
      const lastArg = args[args.length - 1]
      const done = typeof lastArg === 'function' ? lastArg : () => {}
      const routeParams = typeof args[1] === 'object' ? args[1] : {}
      const options = typeof args[2] === 'object' ? args[2] : {}
      // UNKNOWN_ROUTE
      if (!this.router.buildState(routeName, routeParams)) {
        // add router
        this.router.add({
          name: routeName,
          path: pathName,
        })
        _oldNavigate(routeName, routeParams, options, done)
      } else {
        _oldNavigate(routeName, routeParams, options, done)
      }
    }

    this.router.usePlugin(browserPlugin(config.router?.option))
    this.router.useMiddleware(beforMiddleware)
    this.router.subscribe(({ route, previousRoute }) => {
      notify('@@router', 'after', { route, previousRoute })
    })
    enhanceContext('context', { router: this.router })
    this.Container = createComponent(config.Container)
  }

  start(path) {
    this.router.start(path || '/', (err, state) => {
      console.log(err, state)
    })
    const AppContainer = this.Container
    ReactDOM.render(<AppContainer />, document.getElementById('root'))
  }
}

export default App
