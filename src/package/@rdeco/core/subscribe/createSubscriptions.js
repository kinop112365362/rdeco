/* eslint-disable react/display-name */
import { combination } from '../store/combination'

export function createSubscriptions(store) {
  const subscriptions = []
  const observe = {
    next(value) {
      if (value === null) {
        return
      }
      const { subjectKey, fnKey } = value?.eventTargetMeta
      const { targetMeta } = value
      const handle = () => {
        if (store.subscribe[targetMeta.baseSymbol]) {
          store.subscribe[targetMeta.baseSymbol]?.[subjectKey]?.[fnKey]?.call(
            store,
            value.data
          )
        } else {
          /**
           * 如果不能直接通过 target 命中, 意味着这是一个批量订阅, 再执行过程中需要对消息源进行匹配, 命中才执行
           */
          const matchsSubscriberKey = Object.keys(store.subscribe).find(
            (rawName) => {
              const [name, propsKey, propsValue] =
                combination.$metaHandle(rawName)
              if (name === targetMeta.baseSymbol) {
                if (targetMeta.props[propsKey] === propsValue) {
                  return true
                }
                return false
              }
            }
          )
          if (matchsSubscriberKey) {
            store.subscribe[matchsSubscriberKey]?.[subjectKey]?.[fnKey]?.call(
              store,
              value.data
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
  }
  const depsSource = combination.subjects.deps[store.baseSymbol]
  if (depsSource) {
    depsSource.forEach((targetKey) => {
      const source = combination.subjects.target[targetKey]
      if (source) {
        if (Array.isArray(source)) {
          source.forEach((targetSubjects) => {
            targetSubjects.forEach((targetSubject) => {
              subscriptions.push(targetSubject.subscribe(observe))
            })
          })
        } else {
          Object.keys(source).forEach((targetSubject) => {
            if (source[targetSubject].subscribe) {
              subscriptions.push(source[targetSubject].subscribe(observe))
            }
          })
        }
      }
    })
  }

  Object.keys(combination.extends).forEach((extend) => {
    const { subject, observeCreator } = combination.extends[extend]
    subscriptions.push(subject.subscribe(observeCreator(store)))
  })

  let selfSubscription = null
  if (store.notification) {
    selfSubscription = store.notificationSubject.subscribe({
      next(value) {
        if (value !== null) {
          // 代理订阅中的事件不包含 eventTargetMeta ,因为它不是一个标准的公共通道事件
          if (!store.notification[value.fnKey]) {
            throw new Error(
              `调用失败, ${store.name} 组件的 notification 上不存在 ${value.fnKey} 方法`
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
          store.notification?.[value?.fnKey]?.call(
            store,
            value.data,
            value.next
          )
        }
      },
    })
  }
  return { selfSubscription, subscriptions }
}
