/* eslint-disable import/no-unresolved */
import { useEffect } from 'react'
import { createSubscriptions } from '../../core'

export function useSubscribe(store) {
  useEffect(() => {
    const { selfSubscription, subscriptions } = createSubscriptions(store)
    return () => {
      subscriptions.forEach((sub) => {
        sub.unsubscribe()
      })
      selfSubscription?.unsubscribe()
    }
  }, [])
}
