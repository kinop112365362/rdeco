/* eslint-disable valid-jsdoc */
/* eslint-disable react/display-name */
// @filename: Store.js
import { bindContext } from './bind-context'
import { combination } from './combination'
import { getReducerType } from './utils/get-reducer-model'
import createName from './utils/create-name'
import { storeConfigValidate } from './utils/store-config-validate'
import { BehaviorSubject } from 'rxjs'
import { notify } from './notify'

export class Store {
  constructor(storeConfig) {
    if (!storeConfig.name && typeof storeConfig.name !== 'string') {
      throw new Error(`组件必须声明 name 字段, 不可以为空`)
    }
    const { viewKeys, ctrlKeys, serviceKeys } = storeConfigValidate(storeConfig)
    this.state = { ...storeConfig.state }
    if (storeConfig.derived) {
      this.derived = {}
      const propsObj = {}
      const derivedKeys = Object.keys(storeConfig.derived)
      derivedKeys.forEach((derivedKey) => {
        propsObj[derivedKey] = {
          get: () => {
            return storeConfig.derived[derivedKey].call(this)
          },
        }
      })
      Object.defineProperties(this.derived, propsObj)
    }
    this.name = createName(storeConfig)
    this.subjects = {
      stateSubject: new BehaviorSubject(null),
      controllerSubject: new BehaviorSubject(null),
      viewSubject: new BehaviorSubject(null),
      serviceSubject: new BehaviorSubject(null),
      hooksSubject: new BehaviorSubject(null),
    }
    this.style = { ...storeConfig.style }
    this.readState = (componentName) => {
      try {
        return { ...combination.components[componentName].state }
      } catch (error) {
        throw new Error(`${componentName} 组件尚未实例化`)
      }
    }
    this.setter = {}
    this.props = {}
    // eslint-disable-next-line no-undef
    this.notify = notify
    this.hooks = (fnKey, data) => {
      const reg = new RegExp('^[a-z]+([A-Z][a-z]+)+$')
      if (!reg.test(fnKey)) {
        throw new Error(`this.hooks 只支持驼峰命名的 hook`)
      }
      const value = {
        eventTargetMeta: {
          componentName: this.props.sid
            ? `${this.name.split('_')[0]}:sid`
            : this.name.split('_')[0],
          subjectKey: 'hooks',
          fnKey,
        },
        data,
      }
      combination.$broadcast(this.name, value, 'hooks')
    }

    const baseContext = {
      name: this.name,
      state: this.state,
      derived: this.derived,
      style: this.style,
      props: this.props,
      entites: combination.entites,
      hooks: this.hooks,
      notify: this.notify,
      readState: this.readState,
    }
    const stateKeys = Object.keys(this.state)
    stateKeys.forEach((stateKey) => {
      const type = getReducerType(stateKey)
      this.setter[stateKey] = (payload) => {
        this.dispatch([type, payload, stateKey, this.name])
        return payload
      }
    })
    this.private = {
      controllerContext: { ...baseContext },
      viewContext: { ...baseContext },
      serviceContext: { ...baseContext },
    }
    const instance = this
    const { view, controller, service } = storeConfig
    const viewBindContext = bindContext(
      viewKeys,
      view,
      this.private.viewContext,
      instance,
      'view'
    )
    const ctrlBindContext = bindContext(
      ctrlKeys,
      controller,
      this.private.controllerContext,
      instance,
      'controller'
    )
    const serviceBindContext = bindContext(
      serviceKeys,
      service,
      this.private.serviceContext,
      instance,
      'service'
    )
    this.private.serviceContext.service = serviceBindContext
    this.private.serviceContext.setter = this.setter
    this.private.controllerContext.service = serviceBindContext
    this.private.controllerContext.setter = this.setter
    this.private.viewContext.controller = ctrlBindContext
    this.private.viewContext.view = viewBindContext
    this.view = viewBindContext
    this.controller = ctrlBindContext
    this.service = serviceBindContext
  }
  dispatch() {
    throw new Error('dispatch 没有被正确初始化, 请检查 hook 初始化部分的代码')
  }
  dispose() {
    combination.$remove(this.name)
  }
  update(state, dispatch, props, ref) {
    for (const contextName in this.private) {
      if (Object.hasOwnProperty.call(this.private, contextName)) {
        this.private[contextName]['state'] = state
        this.private[contextName]['props'] = props
        this.private[contextName]['ref'] = ref
      }
    }
    this.dispatch = dispatch
    this.state = state
    this.ref = ref
    this.props = props
  }
}
