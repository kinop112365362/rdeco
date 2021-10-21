/* eslint-disable no-unused-vars */
/* eslint-disable valid-jsdoc */
/* eslint-disable react/display-name */
// @filename: Store.js
import { bindContext } from './bindContext'
import { combination } from './combination'
import { getReducerType } from './utils/getReducerModel'
import createName from './utils/createName'
import { storeConfigValidate } from './utils/storeConfigValidate'
import { BehaviorSubject } from 'rxjs'
import { notify } from './notify'
import { isFunction } from './utils/isFunction'
import * as deepmerge from 'deepmerge'

export class Store {
  constructor(storeConfig) {
    if (!storeConfig.name && typeof storeConfig.name !== 'string') {
      throw new Error(`组件必须声明 name 字段, 不可以为空`)
    }
    const { viewKeys, ctrlKeys, serviceKeys } = storeConfigValidate(storeConfig)
    this.state = { ...storeConfig.state }
    if (storeConfig.derivate) {
      this.derivate = {}
      const baseHandler = {}
      const derivateKeys = Object.keys(storeConfig.derivate)

      derivateKeys.forEach((derivateKey) => {
        if (isFunction(storeConfig.derivate[derivateKey])) {
          baseHandler[derivateKey] = {
            get: () => {
              return storeConfig.derivate[derivateKey].call(
                this,
                this.state[derivateKey],
                this.state
              )
            },
          }
        } else {
          combination.$connectAsync(derivateKey, (target) => {
            if (!target) {
              throw new Error(
                `${derivateKey} 组件未定义或 unmount, 跨组件状态派生, 被派生组件必须实例化且处于 mount`
              )
            }
            const targetDerivateKeys = Object.keys(
              storeConfig.derivate[derivateKey]
            )
            const targetHandler = {}
            targetDerivateKeys.forEach((targetDerivateKey) => {
              if (!target.state[targetDerivateKey]) {
                throw new Error(
                  `${derivateKey}.state.${targetDerivateKey} 未定义, 无法派生, 请检查`
                )
              }
              targetHandler[targetDerivateKey] = {
                get: () => {
                  return storeConfig.derivate[derivateKey][
                    targetDerivateKey
                  ].call(this, target.state[targetDerivateKey], target.state)
                },
              }
            })
            this.derivate[derivateKey] = {}
            Object.defineProperties(this.derivate[derivateKey], targetHandler)
          })
        }
      })
      Object.defineProperties(this.derivate, baseHandler)
    }
    this.name = createName(storeConfig)
    this.subjects = {
      state: new BehaviorSubject(null),
      controller: new BehaviorSubject(null),
      view: new BehaviorSubject(null),
      service: new BehaviorSubject(null),
      tappable: new BehaviorSubject(null),
    }
    this.style = { ...storeConfig.style }
    this.setter = {}
    this.props = {}
    // eslint-disable-next-line no-undef
    this.notify = notify
    this.tappable = (fnKey, data) => {
      const reg = new RegExp('^[a-z]+([A-Z][a-z]+)+$')
      if (!reg.test(fnKey)) {
        throw new Error(`this.tappable 只支持驼峰命名的 hook`)
      }
      const value = {
        eventTargetMeta: {
          componentName: this.props.sid ? this.name.split('_')[0] : this.name,
          subjectKey: 'tappable',
          fnKey,
        },
        data,
      }

      combination.$broadcast(this.name, value, 'tappable')
    }

    const baseContext = {
      name: this.name,
      state: this.state,
      derivate: this.derivate,
      style: this.style,
      props: this.props,
      tappable: this.tappable,
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
  dispatch([...args]) {
    if (/Entity$/.test(this.name)) {
      const [type, payload, stateKey, name] = args
      const prevState = { ...this.state[stateKey] }
      this.state[stateKey] = payload
      const value = {
        eventTargetMeta: {
          componentName: name,
          subjectKey: 'state',
          fnKey: stateKey,
        },
        data: {
          prevState,
          nextState: payload,
          state: this.state,
        },
      }
      combination.$broadcast(name, value, 'state')
    } else {
      throw new Error('dispatch 没有被正确初始化, 请检查 hook 初始化部分的代码')
    }
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
