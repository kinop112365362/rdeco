/* eslint-disable import/no-unresolved */
import { useEffect } from 'react'
import { createSubscriptions } from '@rdeco/core'

export function useSubscribe(store, proxySubject) {
  useEffect(() => {
    const { routerSubscription, selfSubscription, subscriptions } =
      createSubscriptions(store, proxySubject)
    return () => {
      subscriptions.forEach((sub) => {
        sub.unsubscribe()
      })
      routerSubscription?.unsubscribe()
      selfSubscription?.unsubscribe()
    }
  }, [])
}
