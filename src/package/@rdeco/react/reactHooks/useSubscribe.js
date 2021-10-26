/* eslint-disable import/no-unresolved */
import { useEffect } from 'react'
import { createSubscriptions } from '../../core'

export function useSubscribe(store, proxySubject) {
  useEffect(() => {
    const { selfSubscription, subscriptions } = createSubscriptions(
      store,
      proxySubject
    )
    return () => {
      subscriptions.forEach((sub) => {
        sub.unsubscribe()
      })
      selfSubscription?.unsubscribe()
    }
  }, [])
}
