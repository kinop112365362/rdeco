export function initStateMetaHandler({ initState: initStateMeta, ref }) {
  const initStateMetaIsArray = Array.isArray(initStateMeta)
  let initState
  let init
  if (initStateMetaIsArray) {
    initState = initStateMeta[0]
    init = initStateMeta[1]
  } else {
    initState = initStateMeta
    init = (state) => state
  }
  const stateKeys = Object.keys(initState)
  let refKeys
  if (ref) {
    refKeys = Object.keys(ref)
  }
  return {
    initState,
    stateKeys,
    refKeys,
    init,
  }
}
