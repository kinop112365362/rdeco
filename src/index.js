import { configCreateStore as configCreateStoreInstance } from './config-create-store'
import { createStoreHook } from './core/create-store-hook'
export { AppContext } from './core/app-context'

export function configCreateStore(config) {
  return configCreateStoreInstance.main(config)
}

// 兼容 1.x 版本下的 createStore API
function createStore(storeConfig) {
  return createStoreHook.main(storeConfig)
}

export default createStore
