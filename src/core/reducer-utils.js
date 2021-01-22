import { shared } from './shared'

class CreateReducerCase {
  readIsFunction(value) {
    return typeof value === 'function'
  }
  readIsStateIsUndefined(nextState, stateKeys) {
    const nextStateKeys = Object.keys(nextState)
    const ghostKeys = nextStateKeys.filter((key) => !stateKeys.includes(key))
    if (ghostKeys.length) {
      throw new Error(
        `不存在的 state => [${ghostKeys.toString()}], 请确保setState中更新的state在initState中已经声明`
      )
    }
  }
  main(stateKeys, dispatch, state) {
    const rc = {
      setState: (nextState) => {
        console.log(nextState, 19)
        if (this.readIsFunction(nextState)) {
          console.log(nextState, 21)
          dispatch(['setState', nextState(state)])
        }
        this.readIsStateIsUndefined(nextState, stateKeys)
        dispatch(['setState', nextState])
      },
    }
    stateKeys.forEach((stateKey) => {
      const type = shared.getReducerType.main(stateKey)
      rc[type] = (payload) => {
        if (this.readIsFunction(payload)) {
          dispatch([type, payload(state[stateKey])])
        } else {
          dispatch([type, payload])
        }
      }
    })
    return rc
  }
}

class ReducerUtils {
  readActionIsUndefined(reducerModel, action) {
    if (reducerModel[action[0]] === undefined) {
      throw new Error(`不存在的 action => ${action[0]}, 清核对代码`)
    }
  }
  writeGetReducerModel(stateKeys) {
    // eslint-disable-next-line no-unused-vars
    return (state) => {
      const reducerModel = {
        setState: (nextState) => ({ ...nextState }),
      }
      stateKeys.forEach((stateKey) => {
        const type = shared.getReducerType.main(stateKey)
        reducerModel[type] = (payload) => {
          if (Array.isArray(payload)) {
            return {
              [stateKey]: payload.map((p) => p),
            }
          }
          return { [stateKey]: payload }
        }
      })
      return reducerModel
    }
  }
  main(stateKeys) {
    return (state, action) => {
      const reducerModel = this.writeGetReducerModel(stateKeys)(state)
      this.readActionIsUndefined(reducerModel, action)
      const result = reducerModel[action[0]](action[1])
      console.group(action[0])
      console.log('prev store.state =>', state)
      console.log('next state =>', action[1])
      console.groupEnd()
      return {
        ...state,
        ...result,
      }
    }
  }
}

export const reducerUtils = new ReducerUtils()
export const createReducerCase = new CreateReducerCase()
