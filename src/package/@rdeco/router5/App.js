import React from 'react'
import ReactDOM from 'react-dom'
import createRouter from 'router5'
import browserPlugin from 'router5-plugin-browser'
import loggerPlugin from 'router5-plugin-logger'
import { enhanceContext } from '../core'
import { createComponent } from '../react'
import { beforeDoneMiddleware, beforMiddleware } from './beforMiddleware'
import { getRouterConfig, pathToName } from './utils'

class App {
  constructor(config) {
    if (!config.Container) {
      throw new Error(
        'Container 未定义, config 内必须声明 Container 作为应用的容器组件'
      )
    }
    const routerConfig = config.routerConfig || {}
    const {
      router5Option = { allowNotFound: true },
      beforeDone,
      browserPluginOption = { useHash: true },
      loggerPluginEnable = false,
    } = getRouterConfig(routerConfig)
    const routers = config?.router || [{ name: '/', path: '/' }]
    this.router = createRouter(routers, router5Option)

    const _oldNavigate = this.router.navigate.bind(this)
    this.router.navigate = (...args) => {
      const pathName = args[0]
      const routeName = this.router.matchPath(pathName)
        ? this.router.matchPath(pathName).name
        : pathToName(pathName)
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

    if (loggerPluginEnable) {
      this.router.usePlugin(browserPlugin(browserPluginOption), loggerPlugin)
    } else {
      this.router.usePlugin(browserPlugin(browserPluginOption))
    }
    this.router.useMiddleware(beforeDoneMiddleware(beforeDone), beforMiddleware)
    enhanceContext('context', { router: this.router })
    this.Container = createComponent(config.Container)
  }

  start(path) {
    this.router.start(
      path || window.location.hash.replace('#', ''),
      (err, state) => {
        console.log(err, state)
      }
    )
    const AppContainer = this.Container
    ReactDOM.render(<AppContainer />, document.getElementById('root'))
  }
}

export default App
