import deepmerge from 'deepmerge'
import isPlainObject from 'lodash.isplainobject'

export function createCompose(template) {
  if (template.name) {
    throw new Error(`compose template 不能定义 name`)
  }
  if (template.view && template.view.render) {
    throw new Error(`compose template 不能定义 view.render`)
  }
  return template
}

export function compose(baseConfig, templates) {
  templates.forEach((template) => {
    Object.keys(baseConfig).forEach((configKey) => {
      if (isPlainObject(baseConfig[configKey])) {
        const fnKeys = Object.keys(baseConfig[configKey])
        if (template[configKey]) {
          const templateFnKeys = Object.keys(template[configKey])
          templateFnKeys.forEach((templateFnKey) => {
            if (fnKeys.find((v) => v == templateFnKey)) {
              throw new Error(`${templateFnKey} 重复定义，无法被 compose`)
            }
          })
        }
      }
    })
    baseConfig = deepmerge(baseConfig, template)
  })
  return baseConfig
}
