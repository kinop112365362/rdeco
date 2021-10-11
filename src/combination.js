import { connectSubject } from './subject'

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
  $set(storeConfig, ins) {
    this[ins.name] = ins
    this.names.push(ins.name)
  },
}
