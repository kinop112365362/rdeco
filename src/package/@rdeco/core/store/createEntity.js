/* eslint-disable no-undef */
import { combination } from './combination'
import { createStore } from './createStore'
import { createSubscriptions } from '../subscribe/createSubscriptions'
import { validate } from '../utils/validate'
import { ReplaySubject } from 'rxjs'

export function createEntity(entity) {
  const symbol = validate(entity.name)
  entity.baseSymbol = symbol
  const entityStore = createStore(entity)
  combination.$set(symbol, entityStore)
  const proxySubject = {
    subject: new ReplaySubject(99),
    ins: entityStore,
    shadow: [],
  }
  createSubscriptions(entityStore, proxySubject)
  return { symbol }
}
