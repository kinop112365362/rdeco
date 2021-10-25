/* eslint-disable react/display-name */
import { combination } from '../store/combination'
import { createRouterSubscription } from './createRouterSubscription'
import { createSelfSubscription } from './createSelfSubscription'
import { createSubscription } from './createSubscription'

export function createSubscriptions(store, proxySubject) {
  const subscriptions = []
  const bindSubject = createSubscription(store)
  if (store.subscribe) {
    const subscribeIds = combination.subscribeIds[store.baseSymbol]
    Object.keys(subscribeIds).forEach((subjectKey) => {
      subscribeIds[subjectKey].forEach((subscribeId) => {
        combination.$connectAsync(subscribeId, (target) => {
          bindSubject(target.subjects[subjectKey])
        })
      })
    })
  }
  const routerSubscription = createRouterSubscription(store)
  const selfSubscription = createSelfSubscription(
    bindSubject,
    store,
    proxySubject
  )
  return { routerSubscription, selfSubscription, subscriptions }
}
