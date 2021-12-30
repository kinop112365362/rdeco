/* eslint-disable import/no-unresolved */
import { useEffect } from 'react'
import { createSubscriptions } from '@rdeco/core'

export function useSubscribe(store) {
  useEffect(() => {
    if (store?.props?.closeSubscribe !== true) {
      const { selfSubscription, subscriptions } = createSubscriptions(store)
      return () => {
        subscriptions.forEach((sub) => {
          sub.unsubscribe()
        })
        selfSubscription?.unsubscribe()
      }
    }
  }, [])
}
