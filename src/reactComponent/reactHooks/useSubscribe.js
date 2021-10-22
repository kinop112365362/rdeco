import { useEffect } from 'react'
import { createSubscriptions } from '../../subscribe/createSubscriptions'

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
