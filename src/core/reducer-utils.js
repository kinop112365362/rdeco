/* eslint-disable no-prototype-builtins */
import { log } from '../utils/log'

const getReducerType = (stateKey) =>
  `set${stateKey.charAt(0).toUpperCase()}${stateKey.slice(1)}`
// const getStateKey = (type) => `${type.charAt(3).toLowerCase()}${type.slice(4)}`

export const reducerHelper = (createReducer) => (state, action) => {
  const reducerModel = createReducer(state)
  log(reducerModel, 5)
  if (reducerModel[action[0]] === undefined) {
    throw new Error(`不存在的 action => ${action[0]}, 清核对代码`)
  }

  const result = reducerModel[action[0]](action[1])
  if (reducerHelper.debugger) {
    console.group(action[0])
    console.log('prev store.state =>', state)
    console.log('next state =>', action[1])
    console.groupEnd()
  }
  return {
    ...state,
    ...result,
  }
}
reducerHelper.debugger = true

export const createReducer = (stateKeys) => () => {
  const reducer = {
    setState: (nextState) => ({ ...nextState }),
  }
  stateKeys.forEach((stateKey) => {
    const type = getReducerType(stateKey)
    reducer[type] = (payload) => {
      if (Array.isArray(payload)) {
        return {
          [stateKey]: payload.map((p) => p),
        }
      }
      return { [stateKey]: payload }
    }
  })
  return reducer
}
function isFunction(value) {
  return typeof value === 'function'
}
export function createRC(stateKeys, dispatch, state) {
  const rc = {
    setState(nextState) {
      if (isFunction(nextState)) {
        dispatch(['setState', nextState(state)])
      }
      const nextStateKeys = Object.keys(nextState)
      const ghostKeys = nextStateKeys.filter((key) => !stateKeys.includes(key))

      if (ghostKeys.length) {
        throw new Error(
          `不存在的 state => [${ghostKeys.toString()}], 请确保setState中更新的state在initState中已经声明`
        )
      } else {
        dispatch(['setState', nextState])
      }
    },
  }
  stateKeys.forEach((stateKey) => {
    const type = getReducerType(stateKey)
    rc[type] = (payload) => {
      if (isFunction(payload)) {
        console.log(payload(state[stateKey]), 67)
        dispatch([type, payload(state[stateKey])])
      } else {
        dispatch([type, payload])
      }
    }
  })
  return rc
}
