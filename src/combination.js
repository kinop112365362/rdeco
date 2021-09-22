import { connectSubject } from './behaviorSubject'

/* eslint-disable no-undef */
export const combination = {
  names: [],
  deps: {},
  entites: {},
  $remove(componentName) {
    if (this[componentName]) {
      delete this[componentName]
    }
  },
  $connectAsync(componentName, call) {
    if (this[componentName]) {
      call(this[componentName])
    } else {
      const connectSub = connectSubject.subscribe({
        next: ({ name, componentInstance }) => {
          if (name === componentName) {
            call(componentInstance)
            if (connectSub) {
              connectSub.unsubscribe()
            }
          }
        },
      })
    }
  },
  $connect(componentName) {
    if (this[componentName]) {
      return this[componentName]
    } else {
      console.warn(
        `${componentName} 组件 unmount, 当前无法 connect, 请使用 this.$connectAsync 进行操作`
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
    Object.freeze(ins.service)
    Object.freeze(ins.dervied)
    Object.freeze(ins.controller)
    Object.freeze(ins.view)
    // 原有版本中循环带有 name 字段的组件, 在没有 sid 的情况下, 无法保持对 this 的正确引用
    // 因此对于包含 name 字段, 但没有 sid 字段的循环组件应当不做缓存
    if (storeConfig.name) {
      Object.freeze(ins.name)
      if (storeConfig.sid) {
        Object.freeze(ins.sid)
        const cName = `${storeConfig.name}_${storeConfig.sid}`
        // if (this[cName]) {
        // throw new Error(`${cName} 已存在, 检查 sid 是否重复`)
        // } else {
        this[cName] = ins
        connectSubject.next({
          name: cName,
          componentInstance: ins,
        })
        this.names.push(cName)
        // }
      } else {
        // console.log(this[storeConfig.name])
        // if (this[storeConfig.name]) {
        // throw new Error(`${storeConfig.name} 已存在, 检查 name 是否重复`)
        // } else {
        this[storeConfig.name] = ins
        connectSubject.next({
          name: storeConfig.name,
          componentInstance: ins,
        })
        this.names.push(storeConfig.name)
        // }
      }
    }
  },
}
