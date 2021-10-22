export function storeConfigValidate(storeConfig) {
  if (!storeConfig.name) {
    throw new Error(`name 未定义`)
  }
  if (!storeConfig.service) {
    storeConfig.service = {}
  }
  const keys = {
    viewKeys: [],
    ctrlKeys: [],
    serviceKeys: Object.keys(storeConfig.service),
  }
  if (storeConfig.view) {
    keys.viewKeys = Object.keys(storeConfig.view)
    keys.viewKeys.forEach((viewKey) => {
      const isNotStartWithRender = !viewKey.startsWith('render')
      if (isNotStartWithRender) {
        throw new Error(`${viewKey} 命名必须以 render 开头`)
      }
    })
  }
  if (storeConfig.controller) {
    keys.ctrlKeys = Object.keys(storeConfig.controller)
    keys.ctrlKeys.forEach((ctrlKey) => {
      const isNotStartWithON = !ctrlKey.startsWith('on')
      if (isNotStartWithON) {
        throw new Error(`${ctrlKey} 命名必须以 on 开头, 名词 + 动词结尾`)
      }
    })
  }
  return keys
}
