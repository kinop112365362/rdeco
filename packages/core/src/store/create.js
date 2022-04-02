/* eslint-disable no-undef */
import { combination } from './combination'
import { createSubscriptions } from '../subscribe/createSubscriptions'
import { Store } from './Store'
import deepmerge from 'deepmerge'

async function create(entityRaw) {
  const entity = deepmerge({}, entityRaw)
  const symbol = entity.name
  entity.baseSymbol = symbol
  if (!combination.components[symbol]) {
    const entityStore = new Store(entity)
    combination.$register(symbol, entityStore, true)
    createSubscriptions(entityStore)
    if (entityStore.controller.onMount) {
      await entityStore?.controller?.onMount()
    }
    return entityStore
  }
  return combination.components[symbol]
}

export { create }
