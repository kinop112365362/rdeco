/* eslint-disable import/no-unresolved */
import { useEffect } from 'react'
import { createSubscriptions } from '../../core'

export function useSubscribe(store, notificationSubject) {
  useEffect(() => {
    const { selfSubscription, subscriptions } = createSubscriptions(
      store,
      notificationSubject
    )
    return () => {
      subscriptions.forEach((sub) => {
        sub.unsubscribe()
      })
      selfSubscription?.unsubscribe()
    }
  }, [])
}
