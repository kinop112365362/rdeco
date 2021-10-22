export function createSelfSubscription(bindSubject, store, proxySubject) {
  if (store.notification) {
    return bindSubject(proxySubject.subject)
  }
}
