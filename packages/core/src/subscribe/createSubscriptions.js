/* eslint-disable react/display-name */
import { combination } from '../store/combination'

export const createObserve = (store, props) => {
  return {
    next(value) {
      if (value === null) {
        return
      }
      const { subjectKey, fnKey } = value?.eventTargetMeta
      const { targetMeta } = value
      const handle = () => {
        if (targetMeta) {
          store?.subscriber?.[targetMeta.baseSymbol]?.[subjectKey]?.[
            fnKey
          ]?.call(store, value.data, props)
          combination.pluginSubject.next({
            ...value,
            source:
              store?.subscriber?.[targetMeta.baseSymbol]?.[subjectKey]?.[fnKey],
          })
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
  }
}
export function createSubscriptions(store) {
  const subscriptions = []
  const depsSource = combination.subjects.deps[store.baseSymbol]
  depsSource?.forEach((targetKey) => {
    const proxy = combination.subjects.targetsProxy[targetKey]
    subscriptions.push(
      proxy.subscribe({
        next(targetsQueue) {
          if (targetsQueue && targetsQueue.length > 0) {
            targetsQueue.forEach((targetStore) => {
              Object.keys(targetStore.subjects).forEach((targetSubjectKey) => {
                if (targetStore.subjects[targetSubjectKey].subscribe) {
                  subscriptions.push(
                    targetStore.subjects[targetSubjectKey].subscribe(
                      createObserve(store, targetStore.props)
                    )
                  )
                }
              })
            })
          }
        },
      })
    )
  })

  Object.keys(combination.extends).forEach((extend) => {
    const { subject, observeCreator } = combination.extends[extend]
    subscriptions.push(subject.subscribe(observeCreator(store)))
  })

  let selfSubscription = null
  if (store.exports) {
    selfSubscription = store.notificationSubject.subscribe({
      next(value) {
        if (value !== null) {
          // 代理订阅中的事件不包含 eventTargetMeta ,因为它不是一个标准的公共通道事件
          if (!store.exports[value.fnKey]) {
            throw new Error(
              `调用失败, ${store.name} 组件的 exports 上不存在 ${value.fnKey} 方法`
            )
          }
          if (value.finder) {
            if (!value.finder(store.props)) {
              /**
               * 通过 props 对比可以判断是否匹配通知规则, 不匹配则不触发订阅逻辑
               */
              return
            }
          }
          if (value.data.length === 0) {
            store.exports?.[value?.fnKey]?.call(store, value.next)
          } else {
            store.exports?.[value?.fnKey]?.call(store, value.data, value.next)
          }

          combination.pluginSubject.next({
            ...value,
            source: store.exports?.[value?.fnKey],
            targetMeta: {
              baseSymbol: store.baseSymbol,
            },
          })
        }
      },
    })
  }
  return { selfSubscription, subscriptions }
}
