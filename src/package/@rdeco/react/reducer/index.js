import { actionIsUndefined } from '../../core/utils/actionIsUndefined'
import { getReducerModel } from './getReducerModel'
import deepmerge from 'deepmerge'
import { combination } from '../../core'

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
  const value = {
    eventTargetMeta: {
      componentName: action[3],
      subjectKey: 'state',
      fnKey: action[2],
    },
    data: {
      prevState: state[action[2]],
      nextState: action[1],
      state: newState,
    },
  }
  combination.$broadcast(action[3], value, 'state')

  return { ...newState }
}
