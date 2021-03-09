import { createStoreHook } from './core/create-store-hook'

class ConfigCreateStore {
  constructor() {
    this.storeNameList = []
  }
  readStoreNameCheck(name) {
    if (this.storeNameList.includes(name)) {
      console.error(`${name} 已经被其他 store 使用了, 请重新配置`)
    }
    console.log(name, 12)
    if (name === undefined) {
      throw new Error('配置 store 必须配置 name 字段')
    } else {
      this.storeNameList.push(name)
    }
  }
  main() {
    return (storeConfig) => {
      // this.readStoreNameCheck(storeConfig.name)
      return createStoreHook.main(storeConfig)
    }
  }
}

export const configCreateStore = new ConfigCreateStore()
