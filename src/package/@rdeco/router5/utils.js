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

export { pathToName, getRouterConfig }
