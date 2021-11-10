/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable valid-jsdoc */
/* eslint-disable react/display-name */
// @filename: Store.js
import { bindContext } from './bindContext'
import { combination } from './combination'
import { storeConfigValidate } from '../utils/storeConfigValidate'
import { BehaviorSubject } from 'rxjs'
import { notify } from '../subscribe/notify'
import { isFunction } from '../utils/isFunction'
import * as deepmerge from 'deepmerge'

export class Store {
  constructor(storeConfig) {
    const { viewKeys, ctrlKeys, serviceKeys } = storeConfigValidate(storeConfig)
    if (isFunction(storeConfig.state)) {
      this.state = storeConfig.state(storeConfig.props)
    } else {
      this.state = { ...storeConfig.state }
    }
    this.router = storeConfig.router ? { ...storeConfig.router } : null
    this.notification = storeConfig.notification
      ? { ...storeConfig.notification }
      : null
    this.subscribe = storeConfig.subscribe ? { ...storeConfig.subscribe } : null
    this.ref = storeConfig.ref ? { ...storeConfig.ref } : null
    this.baseSymbol = storeConfig.baseSymbol
    this.notificationSubject = combination.$createNotificationSubject(
      storeConfig,
      this.baseSymbol
    )
    Object.keys(combination.enhanceContext).forEach((contextKey) => {
      if (this[contextKey]) {
        throw new Error(`${contextKey} 是 store 上已经存在的, 不可覆盖`)
      }
      this[contextKey] = combination.enhanceContext[contextKey]
    })
    this.symbol = Symbol()
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
        }
      })
      Object.defineProperties(this.derivate, baseHandler)
    }
    this.name = storeConfig.name
    this.style = storeConfig.style ? { ...storeConfig.style } : null
    this.setter = {}
    this.props = storeConfig.props
    this.subjects = {
      state: new BehaviorSubject(null),
      controller: new BehaviorSubject(null),
      service: new BehaviorSubject(null),
      tappable: new BehaviorSubject(null),
      symbol: this.symbol,
    }
    combination.$createSubjects(
      storeConfig,
      this.baseSymbol,
      this.symbol,
      this.props
    )
    combination.$setSubject(this.baseSymbol, this)
    // eslint-disable-next-line no-undef
    this.notify = notify
    this.tap = (fnKey, data) => {
      const reg = new RegExp('^[a-z]+([A-Z][a-z]+)+$')
      if (!reg.test(fnKey)) {
        throw new Error(`this.tap 只支持驼峰命名的 tappable`)
      }
      const value = {
        eventTargetMeta: {
          subjectKey: 'tappable',
          fnKey,
        },
        data,
      }

      combination.$broadcast(this, value, 'tappable')
    }

    const baseContext = {
      name: this.name,
      state: this.state,
      derivate: this.derivate,
      style: this.style,
      props: this.props,
      tap: this.tap,
      setter: this.setter,
      notify: this.notify,
    }
    const stateKeys = Object.keys(this.state)
    stateKeys.forEach((stateKey) => {
      const type = stateKey
      this.setter[stateKey] = (payload) => {
        this.dispatch([type, payload, stateKey, this])
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
    this.private.controllerContext.service = serviceBindContext
    this.private.viewContext.controller = ctrlBindContext
    this.private.viewContext.view = viewBindContext
    this.view = viewBindContext
    this.controller = ctrlBindContext
    this.service = serviceBindContext
  }
  updateState(nextState) {
    this.state = nextState
  }
  dispatch([...args]) {
    const [type, payload, stateKey, store] = args
    const prevState = { ...this.state[stateKey] }
    this.state[stateKey] = payload
    const value = {
      eventTargetMeta: {
        subjectKey: 'state',
        fnKey: stateKey,
      },
      data: {
        prevState,
        nextState: payload,
        state: this.state,
      },
    }
    combination.$broadcast(this, value, 'state')
  }
  dispose() {
    combination.$remove(this.symbol, this.baseSymbol)
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
