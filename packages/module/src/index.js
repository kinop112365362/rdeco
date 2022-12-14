import { combination, invoke, mock } from '@rdeco/core'
import { loadRemoteConfig } from '@afe/browser-runtime-loader'
/* eslint-disable no-undef */
let index = 0
function logger() {
  if (localStorage) {
    if (index <= 30) {
      index++
    } else {
      index = 0
    }
    localStorage.setItem(
      `$$rdeco_inject_log_${index}`,
      JSON.stringify({
        moduleName,
        property,
        argumentsList,
      })
    )
  }
}
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
              if (mock?.[moduleName]?.[property]) {
                return mock[moduleName][property](...argumentsList)
              } else {
                logger()
                return invoke([moduleName], property, ...argumentsList)
              }
            },
          })
        },
      }
    )
  }
}

export async function reqJSON(path) {
  const [appCode, configName] = path.split('/')
  if (!appCode) {
    throw new Error('appCode is unknown')
  }
  if (!configName) {
    throw new Error('configName is unknown')
  }
  const data = await loadRemoteConfig({
    appCode: appCode.split('@')[1],
    name: configName,
    type: 'json',
  })
  return data
}

export function req(path) {
  if (combination.components[path] === undefined) {
    console.info(`${path} 模块未加载，即将开始加载`)
    const [appCode, moduleName, compName] = path.split('/')
    if (!appCode) {
      throw new Error('appCode is unknown')
    }
    if (!moduleName) {
      throw new Error('moduleName is unknown')
    }
    if (!compName) {
      // console.warn(`未指定组件名称，仅加载模块 ${appCode}/${moduleName}`)
    }
    if (
      !combination.loadedConfigNamelist.find(
        (name) => name === `${appCode}/${moduleName}`
      )
    ) {
      combination.loadedConfigNamelist.push(`${appCode}/${moduleName}`)
      loadRemoteConfig({
        appCode: appCode.split('@')[1],
        name: moduleName,
        type: 'js',
      }).then(() => {
        console.info(`${appCode}/${moduleName} 模块加载完成`)
      })
    }
  }
  return inject(path)
}
