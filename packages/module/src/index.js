import { combination, invoke, mock } from '@rdeco/core'
import { loadRemoteConfig } from '@afe/browser-runtime-loader'
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

export function req(path) {
  if (combination.components[path] === undefined) {
    console.warn(`${path} 模块未加载，即将开始加载`)
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
    if (
      !combination.loadedConfigNamelist.find(
        (name) => name === `${appCode}/${configName}`
      )
    ) {
      combination.loadedConfigNamelist.push(`${appCode}/${configName}`)
      loadRemoteConfig({
        appCode: appCode.split('@')[1],
        name: configName,
        type: 'js',
      }).then(() => {
        console.warn(`${appCode}/${configName} 模块加载完成`)
      })
    }
  }
  return inject(path)
}
