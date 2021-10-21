import { useEffect } from 'react'
import { createSubscriptions } from './createSubscriptions'

export function useSubscribe(storeConfig, store) {
  useEffect(() => {
    const { routerSubscription, selfSubscription, subscriptions } =
      createSubscriptions(storeConfig, store)
    return () => {
      subscriptions.forEach((sub) => {
        sub.unsubscribe()
      })
      routerSubscription?.unsubscribe()
      selfSubscription?.unsubscribe()
    }
  }, [])
}
