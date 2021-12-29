import deepmerge from 'deepmerge'

export function createMembrane(baseConfig, membrane) {
  return deepmerge(baseConfig, membrane, {
    arrayMerge(target, source) {
      return source
    },
  })
}
