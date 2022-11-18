/* eslint-disable no-undef */
import { combination } from './combination'
import { createSubscriptions } from '../subscribe/createSubscriptions'
import { Store } from './Store'
import { createMembrane } from './createMembrane'
import { compose } from './compose'

function create(entityRaw, membrane = {}, composeList = []) {
  let entity
  if (composeList.length > 0) {
    entity = createMembrane(compose(entityRaw, composeList), membrane)
  }
  entity = createMembrane(entityRaw, membrane)
  const symbol = entity.name
  entity.baseSymbol = symbol
  if (
    !combination.components[symbol] ||
    combination.components[symbol].length === 0
  ) {
    const entityStore = new Store(entity)
    combination.$register(symbol, entityStore, true)
    const { selfSubscription } = createSubscriptions(entityStore)
    if (entityStore.controller.onMount) {
      entityStore?.controller?.onMount()
    }
    const rawDispose = entityStore.dispose
    entityStore.dispose = () => {
      rawDispose.call(entityStore)
      selfSubscription?.unsubscribe()
    }

    return entityStore
  }
  return combination.components[symbol]
}

export { create }
