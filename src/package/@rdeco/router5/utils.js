function pathToName(path = '') {
  return path === '/'
    ? '/'
    : path
        .substring(1)
        .split('/')
        .reduce(
          (previousValue, currentValue) =>
            previousValue +
            currentValue.replace(currentValue[0], currentValue[0].toUpperCase())
        )
}

function getRouterConfig(config = {}) {
  const defaultRouterConfig = {
    router5Option: { allowNotFound: true },
    beforeDone: null,
    browserPluginOption: { useHash: true },
    loggerPluginEnable: false,
  }

  return Object.assign({}, defaultRouterConfig, config)
}

function getPath(parentPath, path) {
  function handlePath(str) {
    if (str[0] !== '/') {
      str = `/${str}`
    }
    str = str.replace(/(\/*)$/, '')
    str = str.replace(/(\/)\1+/g, '/')
    return str
  }

  let basePath = handlePath(parentPath === '/' ? '' : parentPath || '')
  let subPath = handlePath(path || '/')

  return basePath + subPath || '/'
}

export { pathToName, getRouterConfig, getPath }
