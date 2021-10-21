import { combination } from './combination'
import { createStore } from './createStore'

export function createEntity(entity) {
  if (!/Entity$/.test(entity.name)) {
    throw new Error('Entity 的命名必须以 ***Entity 结尾')
  }
  const entityStore = createStore(entity)
  combination.$set(entity, entityStore, 'entites')
}
