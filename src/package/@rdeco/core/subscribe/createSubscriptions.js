/* eslint-disable react/display-name */
import { combination } from '../store/combination'
import { createNotificationSubscription } from './createNotificationSubscription'
import { createSubscription } from './createSubscription'

export function createSubscriptions(store, proxySubject) {
  const subscriptions = []
  const bindSubject = createSubscription(store)
  if (store.subscribe) {
    const subscribeIds = combination.subscribeIds[store.baseSymbol]
    Object.keys(subscribeIds).forEach((subjectKey) => {
      subscribeIds[subjectKey].forEach((subscribeId) => {
        combination.$connectAllAsync(
          subscribeId,
          (target) => {
            subscriptions.push(bindSubject(target.ins.subjects[subjectKey]))
          },
          store
        )
      })
    })
  }
  Object.keys(combination.extends).forEach((extend) => {
    const { subject, observeCreator } = combination.extends[extend]
    subscriptions.push(subject.subscribe(observeCreator(store)))
  })
  const selfSubscription = createNotificationSubscription(
    bindSubject,
    store,
    proxySubject
  )
  return { selfSubscription, subscriptions }
}
