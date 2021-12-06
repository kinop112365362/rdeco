import { actionIsUndefined } from '../../core/utils/actionIsUndefined'
import { getReducerModel } from './getReducerModel'
import deepmerge from 'deepmerge'

export function reducer(state, action) {
  const stateKeys = Object.keys(state)
  const reducerModel = getReducerModel(stateKeys)(state)
  actionIsUndefined(reducerModel, action)
  const result = reducerModel[action[0]](action[1])
  const newState = deepmerge(state, result, {
    arrayMerge: (objValue, srcValue) => {
      return srcValue
    },
  })
  return { ...newState }
}
