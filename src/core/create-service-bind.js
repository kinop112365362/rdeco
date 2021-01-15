import { log } from '../utils/log'
import { rcsHooks } from '../plugins/rcs-hooks'

export function createServiceBind(service, callEffectContext) {
  if (service) {
    const serviceBind = {}
    const serviceKeys = Object.keys(service)
    serviceKeys.forEach((serviceKey) => {
      const serviceIsArray = Array.isArray(service[serviceKey])
      if (serviceIsArray) {
        serviceBind[serviceKey] = (...args) => {
          rcsHooks.service.beforeRunWithEnhancer(
            serviceKey,
            service[serviceKey],
            callEffectContext.name,
            ...args
          )
          const res = service[serviceKey][1].call(
            {
              ...callEffectContext,
              service: serviceBind,
            },
            ...args
          )
          rcsHooks.service.afterRunWithEnhancer(
            res,
            serviceKey,
            service[serviceKey]
          )
          return res
        }
      } else {
        serviceBind[serviceKey] = (...args) => {
          rcsHooks.service.beforeRun(
            serviceKey,
            callEffectContext.name,
            ...args
          )
          const res = service[serviceKey].call(
            {
              ...callEffectContext,
              service: serviceBind,
            },
            ...args
          )
          rcsHooks.service.afterRun(res, serviceKey)
          return res
        }
      }
    })
    log(serviceBind)
    return serviceBind
  }
  return {}
}
