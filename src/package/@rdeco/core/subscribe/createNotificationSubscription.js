export function createNotificationSubscription(
  bindSubject,
  store,
  notificationSubject
) {
  if (store.notification) {
    return notificationSubject.subscribe({
      next(value) {
        if (value !== null) {
          // 代理订阅中的事件不包含 eventTargetMeta ,因为它不是一个标准的公共通道事件
          if (!store.notification[value.fnKey]) {
            throw new Error(
              `调用失败, ${store.name} 组件的 notification 上不存在 ${value.fnKey} 方法`
            )
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
}
