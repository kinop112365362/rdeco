/* eslint-disable no-unused-vars */
export const logPlugin = (key, info, storeName, args, desc) => {
  if (!logPlugin.debug) {
    return
  }
  const style =
    'color: red;font-size: 12px;font-weight: bold;text-decoration: underline;'
  console.group(`${storeName}.${key}`)
  const arg = args.length > 0 ? args : ['没有入参']
  if (info) {
    console.debug(`说明: ${info} 入参:`, ...arg)
  } else {
    console.debug('入参:', ...arg)
  }
  console.groupEnd()
}
logPlugin.debug = true
