import createName from './utils/create-name'

/* eslint-disable no-undef */
export const combination = {
  names: [],
  deps: {},
  entites: {},
  components: {},
  $remove(componentName) {
    if (this.components[componentName]) {
      this.components[componentName] = null
    }
  },
  $addDep(watchCompnentName, observer) {
    if (this.deps[watchCompnentName]) {
      if (this.deps[watchCompnentName]) {
        this.deps[watchCompnentName][observer.eventName] = observer.handle
      }
    } else {
      this.deps[watchCompnentName] = {
        [observer.eventName]: observer.handle,
      }
    }
  },
  $has({ name, sid }) {
    const componentName = createName({ name, sid })
    if (this.components[componentName]) {
      return true
    }
    return false
  },
  $set(storeConfig, ins) {
    this.components[ins.name] = ins
    this.names.push(ins.name)
  },
}
