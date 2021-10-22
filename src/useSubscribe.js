import { useEffect } from 'react'
import { createSubscriptions } from './createSubscriptions'

export function useSubscribe(store) {
  useEffect(() => {
    const { routerSubscription, selfSubscription, subscriptions } =
      createSubscriptions(store)
    return () => {
      subscriptions.forEach((sub) => {
        sub.unsubscribe()
      })
      routerSubscription?.unsubscribe()
      selfSubscription?.unsubscribe()
    }
  }, [])
}
