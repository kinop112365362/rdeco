export function createSubscription(store) {
  const { subscribe } = store
  return function bindSubject(subject) {
    let subscription = null
    subscription = subject.subscribe({
      next(value) {
        if (value === null) {
          return
        }
        const { componentName, subjectKey, fnKey } = value?.eventTargetMeta
        const handle = () => {
          const meta = subscribe?.[subjectKey]?.find((meta) => {
            const [target] = meta
            return target === componentName
          })
          if (meta) {
            meta[1][fnKey]?.call(store, value.data)
          }
        }
        if (subjectKey === 'state') {
          setTimeout(() => {
            handle()
          }, 33)
        } else {
          handle()
        }
      },
    })
    return subscription
  }
}
