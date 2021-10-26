import React from 'react'
import { combination, createStore, createSubscriptions } from '../core'
import { validate } from '../core/utils/validate'

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}
export function withComponent(WrappedComponent, component) {
  const baseSymbol = validate(component.name)

  class Component extends React.PureComponent {
    constructor(props) {
      super(props)
      this.storeConfig = { ...component }
      this.storeConfig.baseSymbol = baseSymbol
      this.state = {
        updater: 0,
        ...this.storeConfig.state,
      }
      this.ref = { ...component.ref }
      this.store = createStore(this.storeConfig)
      const dispatch = this.dispatch.bind(this)
      this.store.update(this.storeConfig.state, dispatch, this.props, this.ref)
      this.proxySubject = combination.$set(baseSymbol, this.store)
    }
    dispatch(args) {
      // eslint-disable-next-line no-unused-vars
      const [type, payload, stateKey] = args
      this.setState(
        {
          [stateKey]: payload,
        },
        () => {
          this.store.updateState(this.state)
          this.setState({
            updater: new Date().getTime(),
          })
        }
      )
    }
    componentDidMount() {
      if (this.store?.controller?.onMount) {
        this.store.controller.onMount()
      }
      const { routerSubscription, selfSubscription, subscriptions } =
        createSubscriptions(this.store, this.proxySubject)
      this.routerSubscription = routerSubscription
      this.selfSubscription = selfSubscription
      this.subscriptions = subscriptions
    }

    componentWillUnmount() {
      this.store.dispose()
      if (this.store.controller?.onUnmount) {
        this.store.controller.onUnmount()
      }
      this.subscriptions.forEach((sub) => {
        sub.unsubscribe()
      })
      this.routerSubscription?.unsubscribe()
      this.selfSubscription?.unsubscribe()
    }

    render() {
      return (
        <WrappedComponent
          updater={this.state.updater}
          store={this.store}
          {...this.props}
        />
      )
    }
  }
  Component.displayName = `withComponent(${getDisplayName(WrappedComponent)})`
  return Component
}
