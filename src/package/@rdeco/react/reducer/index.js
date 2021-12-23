import { actionIsUndefined } from '../../core/utils/actionIsUndefined'
import { getReducerModel } from './getReducerModel'
import mergeWith from 'lodash.mergewith'
import isPlainObject from 'lodash.isplainobject'

export function reducer(state, action) {
  const stateKeys = Object.keys(state)
  const reducerModel = getReducerModel(stateKeys)(state)
  actionIsUndefined(reducerModel, action)
  const result = reducerModel[action[0]](action[1])
  const newState = mergeWith(state, result, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return [...srcValue]
    }
    if (isPlainObject(objValue) && action[4]) {
      return { ...srcValue }
    }
  })
  return { ...newState }
}
