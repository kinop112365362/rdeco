export function isStateIsUndefined(nextState, stateKeys) {
  const nextStateKeys = Object.keys(nextState)
  const ghostKeys = nextStateKeys.filter((key) => !stateKeys.includes(key))
  if (ghostKeys.length) {
    throw new Error(
      `不存在的 state => [${ghostKeys.toString()}], 请确保setState中更新的state在state中已经声明`
    )
  }
}
