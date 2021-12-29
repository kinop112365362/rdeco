export function getReducerModel(stateKeys) {
  return () => {
    const reducerModel = {
      setState: (nextState) => ({ ...nextState }),
    }
    stateKeys.forEach((stateKey) => {
      const type = stateKey
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
