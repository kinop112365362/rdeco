import { createStore } from './create-store'

export function createStoreContext(storeConfig) {
  storeConfig.name = 'storeContext'
  return createStore(storeConfig)
}
