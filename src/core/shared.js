/* eslint-disable no-prototype-builtins */
export const shared = {
  getReducerType: {
    main(stateKey) {
      return `set${stateKey.charAt(0).toUpperCase()}${stateKey.slice(1)}`
    },
  },
}
