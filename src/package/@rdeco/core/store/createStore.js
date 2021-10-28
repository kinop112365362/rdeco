/* eslint-disable no-undef */
import { combination } from './combination'
import { Store } from './Store'

export function createStore(storeConfig) {
  const store = new Store(storeConfig)
  if (store.subscribe) {
    if (!combination.subscribeIds[store.baseSymbol]) {
      combination.subscribeIds[store.baseSymbol] = {}
    }
    Object.keys(store.subscribe).forEach((subjectKey) => {
      if (!combination.subscribeIds[store.baseSymbol][subjectKey]) {
        combination.subscribeIds[store.baseSymbol][subjectKey] = new Set()
      }
      store.subscribe[subjectKey].forEach((meta) => {
        if (!Array.isArray(meta)) {
          throw new Error(`TypeError: 监听异常, ${meta} 不是数组`)
        }
        const [target] = meta
        combination.subscribeIds[store.baseSymbol][subjectKey].add(target)
      })
    })
  }
  return store
}
