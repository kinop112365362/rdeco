/* eslint-disable no-undef */
import { combination } from './combination'
import { createStore } from './createStore'
import { createSubscriptions } from '../subscribe/createSubscriptions'
import { validate } from '../utils/validate'
import { connectSubject } from '../subscribe/subject'

export function createEntity(entity) {
  const symbol = validate(entity.name)
  entity.baseSymbol = symbol
  const entityStore = createStore(entity)
  const proxySubject = combination.$set(symbol, entityStore)
  createSubscriptions(entityStore, proxySubject)
  connectSubject.next({
    name: symbol,
    proxySubject,
    componentInstance: entityStore,
  })
  return { symbol }
}
