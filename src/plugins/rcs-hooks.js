/* eslint-disable no-unused-vars */
import { logPlugin } from './log-plugin'

export const rcsHooks = {
  controller: {
    beforeRunWithEnhancer(controllerKey, controllerEnhancer, name, ...args) {
      logPlugin(controllerKey, controllerEnhancer[0], name, args, '入参信息')
    },
    afterRunWithEnhancer(result, controllerKey) {},
    beforeRun(controllerKey, name, ...args) {
      logPlugin(controllerKey, null, name, args, '入参信息')
    },
    afterRun(result, controllerKey) {},
  },
  service: {
    beforeRunWithEnhancer(serviceKey, serviceEnhancer, name, ...args) {
      logPlugin(serviceKey, serviceEnhancer[0], name, args, '入参信息')
    },
    afterRunWithEnhancer(result, serviceKey) {},
    beforeRun(serviceKey, name, ...args) {
      logPlugin(serviceKey, null, name, args, '入参信息')
    },
    afterRun(result, serviceKey) {},
  },
}
