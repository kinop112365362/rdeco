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
            /**
             * 针对有 finder 的监听器, 需要再次从参数中解构出 name, 这和 connect 的逻辑相比是一个约定, 后面看看怎么优化
             */
            if (Array.isArray(target)) {
              return target[0] === componentName
            }
            return target === componentName
          })
          if (meta) {
            try {
              meta[1][fnKey]?.call(store, value.data)
            } catch (error) {
              throw new Error(
                `监听器语法异常, 请检查 ${store.baseSymbol} 的 subscribe 内容`
              )
            }
          }
        }
        if (subjectKey === 'state') {
          setTimeout(() => {
            handle()
          }, 16)
        } else {
          handle()
        }
      },
    })
    return subscription
  }
}
