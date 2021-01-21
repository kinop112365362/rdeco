import { Runner } from './plugins/runner'
import { createStoreHook } from './core/create-store-hook'

export const configCreateStore = {
  state: {
    storeNameList: [],
  },
  readStoreNameCheck(name) {
    if (this.state.storeNameList.includes(name)) {
      console.error(`${name} 已经被其他 store 使用了, 请重新配置`)
    }
    if (name === undefined) {
      throw new Error('配置 store 必须配置 name 字段')
    } else {
      this.state.storeNameList.push(name)
    }
  },
  main(config) {
    const runner = new Runner()
    config.plugins.forEach((plugin) => {
      plugin.apply(runner)
    })
    return (storeConfig) => {
      this.readStoreNameCheck(storeConfig.name)
      return createStoreHook.main(storeConfig)
    }
  },
}
