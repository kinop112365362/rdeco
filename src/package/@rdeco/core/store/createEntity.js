/* eslint-disable no-undef */
import { combination } from './combination'
import { createSubscriptions } from '../subscribe/createSubscriptions'
import { validate } from '../utils/validate'
import { Store } from './Store'

export function createEntity(entity) {
  const symbol = validate(entity.name)
  entity.baseSymbol = symbol
  const entityStore = new Store(entity)
  combination.$register(symbol, entityStore)
  createSubscriptions(entityStore)
  if (entityStore.controller.onMount) {
    entityStore?.controller?.onMount()
  }
  return { symbol }
}
