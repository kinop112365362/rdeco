import { combination, invoke } from '@rdeco/core'
/* eslint-disable no-undef */
export function inject(moduleName) {
  combination.loader(moduleName)
  if (!Proxy) {
    throw new Error(`当前浏览器不支持 Proxy, 无法使用 inject api 请改用 invoke`)
  }
  return new Proxy(
    {},
    {
      get: function (target, property) {
        return new Proxy(function () {}, {
          apply: function (target, thisArg, argumentsList) {
            return invoke([moduleName], property, argumentsList)
          },
        })
      },
    }
  )
}
