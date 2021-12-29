import queryString from 'query-string'
import { pathToRegexp } from 'path-to-regexp'

function pathToName(path = '') {
  let nowPath = path.split('?')[0]
  if (nowPath === '/') {
    return nowPath
  } else if (nowPath[0] === '/') {
    nowPath = nowPath.substring(1)
  }
  return nowPath
    .split('/')
    .reduce(
      (previousValue, currentValue) =>
        previousValue +
        currentValue.replace(currentValue[0], currentValue[0].toUpperCase())
    )
}

function handlePath(str = '') {
  str = str.split('?')[0]
  if (str === '/') {
    return str
  }
  if (str[0] !== '/') {
    str = `/${str}`
  }
  str = str.replace(/(\/*)$/, '')
  str = str.replace(/(\/)\1+/g, '/')
  return str
}

function getRouterConfig(config = {}) {
  const defaultRouterConfig = {
    router5Option: { queryParamsMode: 'loose', allowNotFound: true },
    beforeDone: null,
    browserPluginOption: { useHash: true },
    loggerPluginEnable: false,
  }

  return Object.assign({}, defaultRouterConfig, config)
}

function getPath(parentPath, path) {
  let basePath = handlePath(parentPath === '/' ? '' : parentPath || '')
  let subPath = handlePath(path || '/')

  if (parentPath && subPath === '/') {
    throw new Error("RouteView props path Can't be nul and '/'")
  }

  return basePath + subPath || '/'
}

function handleRoute(route = {}) {
  if (route?.name === '@@router5/UNKNOWN_ROUTE' && route.params) {
    route.params = {
      ...route.params,
      ...queryString.parseUrl(route?.params?.path || '').query,
    }
  }
  return route
}

function matchPath(currentPath, toStatePath = {}, exact) {
  const regexp = pathToRegexp(currentPath)
  let urlStr = toStatePath
  if (!exact) {
    const length = (currentPath === '/' ? '' : currentPath).split('/').length
    urlStr = toStatePath.split('/').slice(0, length).join('/')
    urlStr = urlStr[0] === '/' ? urlStr : '/' + urlStr
  }

  return Boolean(regexp.exec(urlStr))
}

function getConfigRouters(routers = [{ path: '/' }]) {
  routers.forEach((item) => {
    item.name = item.path === '/' ? '/' : pathToName(item.path)
    if (item.forwardTo) {
      item.forwardTo = pathToName(item.forwardTo)
    }
  })
  return routers
}

export {
  pathToName,
  getRouterConfig,
  getPath,
  handlePath,
  handleRoute,
  matchPath,
  getConfigRouters,
}
