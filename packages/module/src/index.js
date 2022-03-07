import { combination, invoke } from '@rdeco/core'
import { loadRemoteConfig } from '@afe/browser-runtime-loader'
/* eslint-disable no-undef */
export function inject(moduleName) {
  combination.loader(moduleName)
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
              return invoke([moduleName], property, ...argumentsList)
            },
          })
        },
      }
    )
  }
}

export function req(path) {
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
  const fullModuleName = `${appCode}-${configName}/${moduleName}`
  if (!combination.components[fullModuleName]) {
    loadRemoteConfig({
      appCode: appCode.split('@')[1],
      name: configName,
      type: 'js',
    })
  }
  return inject(fullModuleName)
}
