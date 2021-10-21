import { actionIsUndefined } from './utils/actionIsUndefined'
import { getReducerModel } from './utils/getReducerModel'
import { isFunction } from './utils/isFunction'
import deepmerge from 'deepmerge'
import { combination } from './combination'

export function reducer(state, action) {
  const stateKeys = Object.keys(state)
  const reducerModel = getReducerModel(stateKeys)(state)
  actionIsUndefined(reducerModel, action)
  if (isFunction(action[1])) {
    throw new Error(
      '自 1.40.2 开始不在支持 setter 操作中使用函数而非值, 请直接使用 this.state 来替代获取旧值'
    )
  }
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
