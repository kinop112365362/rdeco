import { useEffect } from 'react'

export function useStoreDispose(store) {
  useEffect(() => {
    return () => {
      store.dispose()
      if (store.controller?.onUnmount) {
        store.controller.onUnmount()
      }
    }
  }, [])
}
export function nextTick(tick) {
  tick()
}
