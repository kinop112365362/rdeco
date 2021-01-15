import { createStoreHook } from './create-store-hook'
import { storeNameCheck } from './store-name-check'
import { createStoreTakenMembraneHook } from './create-store-taken-membrane-hook'

export const createStore = (storeConfig) => {
  storeNameCheck(storeConfig.name)
  if (storeConfig.membrane) {
    return createStoreTakenMembraneHook(storeConfig, storeConfig.membrane)
  }
  return createStoreHook(storeConfig)
}
