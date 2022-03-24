/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable valid-jsdoc */
/* eslint-disable react/display-name */
// @filename: Store.js
import { bindContext } from './bindContext'
import { combination } from './combination'
import { storeConfigValidate } from '../utils/storeConfigValidate'
import { BehaviorSubject, ReplaySubject } from 'rxjs'
import { invoke } from '../subscribe/invoke'
import { isFunction } from '../utils/isFunction'
import deepmerge from 'deepmerge'
import { createSubscriptions } from '../index'
import { createObserve } from '../subscribe/createSubscriptions'
import isPlainObject from 'lodash.isplainobject'

export class Store {
  constructor(storeConfig) {
    const { viewKeys, ctrlKeys, serviceKeys } = storeConfigValidate(storeConfig)
    Object.keys(combination.enhanceContext).forEach((contextKey) => {
      if (this[contextKey]) {
        throw new Error(`${contextKey} 是 store 上已经存在的, 不可覆盖`)
      }
      this[contextKey] = combination.enhanceContext[contextKey]
    })
    if (isFunction(storeConfig.state)) {
      this.state = deepmerge(
        {},
        storeConfig.state.call(this, storeConfig.props) || {}
      )
    } else {
      this.state = deepmerge({}, storeConfig.state || {})
    }
    this.router = storeConfig.router ? { ...storeConfig.router } : null
    this.exports = storeConfig.exports ? { ...storeConfig.exports } : null
    if (storeConfig?.subscribe?.self) {
      storeConfig.subscribe[storeConfig.name] = {
        ...storeConfig.subscribe.self,
      }
      delete storeConfig.subscribe.self
    }
    this.subscriber = storeConfig.subscribe
      ? { ...storeConfig.subscribe }
      : null
    this.ref = storeConfig.ref ? { ...storeConfig.ref } : null
    this.baseSymbol = storeConfig.baseSymbol
    this.notificationSubject = combination.$createNotificationSubject(
      storeConfig,
      this.baseSymbol
    )

    this.dynamicSubscription = []
    this.setterCallbacks = []
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
      state: new ReplaySubject(9),
      controller: new BehaviorSubject(null),
      service: new BehaviorSubject(null),
      event: new ReplaySubject(9),
      fallback: new BehaviorSubject(null),
      symbol: this.symbol,
    }
    combination.$createSubjects(this, this.baseSymbol, this.symbol, this.props)
    combination.$setSubject(this.baseSymbol, this)
    // eslint-disable-next-line no-undef
    this.invoke = invoke
    this.emit = (fnKey, data) => {
      const reg = new RegExp('^[a-z]+([A-Z][a-z]+)+$')
      if (!reg.test(fnKey)) {
        throw new Error(`this.emit 只支持驼峰命名的 event`)
      }
      const value = {
        eventTargetMeta: {
          subjectKey: 'event',
          fnKey,
        },
        data,
      }

      combination.$broadcast(this, value, 'event')
    }

    const baseContext = {
      baseSymbol: this.baseSymbol,
      name: this.name,
      state: this.state,
      derivate: this.derivate,
      style: this.style,
      props: this.props,
      emit: this.emit,
      subscribe: this.subscribe,
      setter: this.setter,
      invoke: this.invoke,
      subjects: this.subjects,
      modules: combination.modules,
    }
    const stateKeys = Object.keys(this.state)
    stateKeys.forEach((stateKey) => {
      const type = stateKey
      this.setter[stateKey] = (payload, callback, replace = false) => {
        const value = {
          eventTargetMeta: {
            subjectKey: 'state',
            fnKey: stateKey,
          },
          data: {
            prevState: isPlainObject(this.state[stateKey])
              ? deepmerge({}, this.state[stateKey])
              : this.state[stateKey],
            nextState: payload,
            state: this.state,
          },
        }
        combination.$broadcast(this, value, 'state')
        this.dispatch([type, payload, stateKey, this, replace])
        this.setterCallbacks.push(callback)
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
  subscribe(newSubscribe) {
    const subscriptions = []
    if (this.subscriber) {
      this.subscriber = { ...this.subscriber, ...newSubscribe }
    } else {
      this.subscriber = newSubscribe
    }
    combination.$createSubjects(this, this.baseSymbol)
    Object.keys(newSubscribe).forEach((targetKey) => {
      const proxy = combination.subjects.targetsProxy[targetKey]
      subscriptions.push(
        proxy.subscribe({
          next: (targetsQueue) => {
            if (targetsQueue && targetsQueue.length > 0) {
              targetsQueue.forEach((targetStore) => {
                Object.keys(targetStore.subjects).forEach(
                  (targetSubjectKey) => {
                    if (targetStore.subjects[targetSubjectKey].subscribe) {
                      targetStore.dynamicSubscription.push(
                        targetStore.subjects[targetSubjectKey].subscribe(
                          createObserve(this, targetStore.props)
                        )
                      )
                    }
                  }
                )
              })
              targetsQueue.length = 0
            }
          },
        })
      )
    })
    return function unsubscribe() {
      subscriptions.forEach((sub) => {
        sub.unsubscribe()
      })
    }
  }
  updateState(nextState) {
    this.state = nextState
  }
  dispatch([...args]) {
    const [type, payload, stateKey, store] = args
    this.state[stateKey] = payload
  }
  dispose() {
    this.dynamicSubscription.forEach((s) => {
      s.unsubscribe()
    })
    combination.$remove(this.symbol, this.baseSymbol)
  }
  update(updater) {
    updater(this)
  }
}
