export function getReducerType(stateKey) {
  return `set${stateKey.charAt(0).toUpperCase()}${stateKey.slice(1)}`
}

export function getReducerModel(stateKeys) {
  return () => {
    const reducerModel = {
      setState: (nextState) => ({ ...nextState }),
    }
    stateKeys.forEach((stateKey) => {
      const type = getReducerType(stateKey)
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
