import { combination, invoke, mock } from '@rdeco/core'
import { loadRemoteConfig } from '@afe/browser-runtime-loader'
import npmValidate from 'validate-npm-package-name'
import throttle from 'lodash.throttle'
/* eslint-disable no-undef */
export function inject(moduleName) {
  if (window.Proxy === undefined) {
    console.error(
      `当前浏览器不支持 Proxy, 无法使用 inject api, 需要降级为 invoke api`
    )
  } else {
    return new Proxy(
      {},
      {
        get: function (target, property) {
          return new Proxy(function () {}, {
            apply: function (target, thisArg, argumentsList) {
              if (mock[moduleName]) {
                return mock[moduleName][property](...argumentsList)
              } else {
                return invoke([moduleName], property, ...argumentsList)
              }
            },
          })
        },
      }
    )
  }
}

const throttleLoader = throttle(loadRemoteConfig, 1000)

export function req(path) {
  if (combination.components[path]) {
    return inject(path)
  } else {
    const { validForNewPackages } = npmValidate(path)
    if (!validForNewPackages) {
      const [appCode, configName, moduleName] = path.split('/')
      if (!appCode) {
        throw new Error('appCode is unknown')
      }
      if (!configName) {
        throw new Error('configName is unknown')
      }
      if (!moduleName) {
        throw new Error('moduleName is unknown')
      }
      throttleLoader({
        appCode: appCode.split('@')[1],
        name: configName,
        type: 'js',
      })
    }
    return inject(path)
  }
}
