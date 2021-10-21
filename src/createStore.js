/* eslint-disable no-undef */
import { combination } from './combination'
import { Store } from './Store'
import { forEachByKeys } from './utils/forEachByKeys'

export function createStore(storeConfig) {
  const store = new Store(storeConfig)
  if (storeConfig.subscribe) {
    if (!combination.subscribeNames[store.name]) {
      combination.subscribeNames[store.name] = {}
    }
    forEachByKeys(storeConfig.subscribe, (subjectKey) => {
      if (!combination.subscribeNames[store.name][subjectKey]) {
        combination.subscribeNames[store.name][subjectKey] = new Set()
      }
      forEachByKeys(storeConfig.subscribe[subjectKey], (componentKey) => {
        combination.subscribeNames[store.name][subjectKey].add(componentKey)
      })
    })
  }
  return store
}
