/* eslint-disable react/display-name */
import { combination } from '../store/combination'

const createObserve = (store, props) => {
  return {
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
            value.data,
            props
          )
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
  if (depsSource) {
    depsSource.forEach((targetKey) => {
      const handle = (source) => {
        source.forEach((targetSubjects) => {
          Object.keys(targetSubjects.subject).forEach((targetSubjectKey) => {
            if (targetSubjects.subject[targetSubjectKey].subscribe) {
              subscriptions.push(
                targetSubjects.subject[targetSubjectKey].subscribe(
                  createObserve(store, targetSubjects.props)
                )
              )
            }
          })
        })
      }
      const source = combination.subjects.targets[targetKey]
      if (source) {
        handle(source)
      } else {
        subscriptions.push(combination.$connectTargetSubject(targetKey, handle))
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
