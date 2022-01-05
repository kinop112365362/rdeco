import { extendsSubscribe } from '@rdeco/core'
import { ReplaySubject } from 'rxjs'
import App from './App'
import Redirect from './Redirect'
import { useRouter } from './useRouter'

extendsSubscribe('@@router', {
  subject: new ReplaySubject(2),
  beforeNotify(...args) {
    const [subjectKey, arg, next] = args
    return { subjectKey, arg, next }
  },
  observeCreator(store) {
    if (store.router) {
      return {
        next(value) {
          if (value) {
            store?.router?.[value.subjectKey]?.call(
              store,
              value.arg,
              value.next
            )
          }
        },
      }
    }
  },
})
export { Router, RouteView } from './RouteView'
export { App, Redirect }
export { useRouter }
