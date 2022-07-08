import deepmerge from 'deepmerge'
import { combination, enhanceContext } from './combination'

export function createMembrane(baseConfig, membrane) {
  return deepmerge(baseConfig, membrane, {
    arrayMerge(target, source) {
      return source
    },
  })
}

enhanceContext('membraneStore', {})
export function registerMembrane(componentName, membraneConfig) {
  combination.enhanceContext['membraneStore'][componentName] = membraneConfig
}

export function getRegisterMembrane(componentName) {
  if (combination.enhanceContext['membraneStore']) {
    return combination.enhanceContext['membraneStore'][componentName]
  }
  return null
}
