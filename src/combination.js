/* eslint-disable no-undef */
export const combination = {
  names: [],
  deps: {},
  entites: {},
  $connect(componentName) {
    if (this[componentName]) {
      return this[componentName]
    } else {
      throw new Error(
        `${componentName} 组件不存在, 无法 connect, 当前拥有的已经注册的组件实例 => ${combination}`
      )
    }
  },
  $addDep(targetComponentName, targetStateKey, watchCompnentName) {
    if (this.deps[targetComponentName]) {
      if (this.deps[targetComponentName][targetStateKey]) {
        this.deps[targetComponentName][targetStateKey].add(watchCompnentName)
      }
    } else {
      this.deps[targetComponentName] = {}
      this.deps[targetComponentName][targetStateKey] = new Set([
        watchCompnentName,
      ])
    }
  },
  $find(name, sid) {
    let cName = name
    if (sid) {
      cName = `${name}_${sid}`
    }
    return this[cName]
  },
  $has(storeConfig) {
    const result = this.names.find((name) => {
      if (storeConfig.sid) {
        return name === `${storeConfig.name}_${storeConfig.sid}`
      } else {
        return name === storeConfig.name
      }
    })
    return !!result
  },
  $set(storeConfig, ins) {
    // 原有版本中循环带有 name 字段的组件, 在没有 sid 的情况下, 无法保持对 this 的正确引用
    // 因此对于包含 name 字段, 但没有 sid 字段的循环组件应当不做缓存
    if (storeConfig.name) {
      if (storeConfig.sid) {
        const cName = `${storeConfig.name}_${storeConfig.sid}`
        if (this[cName]) {
          throw new Error(`${cName} 已存在, 检查 sid 是否重复`)
        } else {
          this[cName] = ins
          this.names.push(cName)
        }
      } else {
        console.log(this[storeConfig.name])
        if (this[storeConfig.name]) {
          throw new Error(`${storeConfig.name} 已存在, 检查 name 是否重复`)
        } else {
          this[storeConfig.name] = ins
          this.names.push(storeConfig.name)
        }
      }
    }
  },
}
