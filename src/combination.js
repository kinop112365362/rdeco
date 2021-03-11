// eslint-disable-next-line no-undef
export const combination = new Proxy(
  {},
  {
    get(target, p) {
      if (target[p] === undefined) {
        throw new Error(`${p} 尚未初始化, 无法联结`)
      }
      return target[p][0]
    },
    set(target, p, v) {
      if (target[p] === undefined) {
        target[p] = []
        target[p].push(v)
        // TODO 后续是否需要支持多实例? 更复杂的 event bus?
      }
      if (target[p].length > 1) {
        throw new Error(`${p} 具名 Store 不支持多实例, 请移除 name 属性`)
      }
      return v
    },
  }
)
