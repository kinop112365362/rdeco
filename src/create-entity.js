import defaultsDeep from 'lodash.defaultsdeep'
import { combination } from './combination'

class Entity {
  constructor(rawConfig) {
    this.config = defaultsDeep({}, rawConfig)
    this.params = this.config.params
    this.method = this.config.method
    this.methodContext = {
      params: this.params,
      connect: combination.$connect.bind(combination),
      connectAsync: combination.$connectAsync.bind(combination),
      method: this.method,
    }
    this.bindMethod()
  }
  setParams(params) {
    this.methodContext.params = {
      ...this.methodContext.params,
      ...defaultsDeep({}, params),
    }
  }
  bindMethod() {
    const Mkeys = Object.keys(this.config.method)
    Mkeys.forEach((Mkey) => {
      const rawMethod = this.config.method[Mkey]
      this.method[Mkey] = (...args) => {
        return rawMethod.call(this.methodContext, ...args)
      }
    })
  }
}

export function createEntity(config) {
  if (config.name) {
    if (combination.entites[config.name]) {
      throw new Error(`${config.name}Entity 已创建, 请更换 name`)
    }
    combination.entites[config.name] = new Entity(config)
  } else {
    throw new Error('entity 必须配置 name 字段')
  }
}
