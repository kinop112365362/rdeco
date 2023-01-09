import deepmerge from 'deepmerge'
import isPlainObject from 'lodash.isplainobject'
import { combination } from './combination'

export function createCompose(template, composeId) {
  if (template.name) {
    throw new Error(`compose template 不能定义 name`)
  }
  if (template.view && template.view.render) {
    throw new Error(`compose template 不能定义 view.render`)
  }
  if (composeId) {
    if (!combination.composeRecord[composeId]) {
      combination.composeRecord[composeId] = template
      template.$$id = composeId
    } else {
      console.warn(combination.components)
      // throw new Error(`${composeId} 已经被注册过了`)
    }
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
              console.warn(`当前处理的 template`, template)
              console.warn(`当前处理的 baseConfig`, baseConfig)
              throw new Error(
                `${baseConfig.name} 中的 ${templateFnKey} 重复定义，无法被 compose`
              )
            }
          })
        }
      }
    })
    baseConfig = deepmerge(baseConfig, template)
  })
  return baseConfig
}
