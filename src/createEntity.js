import { combination } from './combination'
import { createStore } from './createStore'
import { createSubscriptions } from './createSubscriptions'

export function createEntity(entity) {
  if (!/Entity$/.test(entity.name)) {
    throw new Error('Entity 的命名必须以 ***Entity 结尾')
  }
  const entityStore = createStore(entity)
  combination.$set(entity, entityStore, 'entites')
  createSubscriptions(entity, entityStore)
}
