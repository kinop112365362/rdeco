import { log } from './utils/log';
import { rcsHooks } from './plugins/rcs-hooks';

export function createControllerBind(controller, callEffectContext) {
  log(callEffectContext);
  if (!controller) {
    throw new Error('任何一个 store 都不能没有 controller');
  }
  const controllerKeys = Object.keys(controller);
  const controllerBind = {};
  controllerKeys.forEach(controllerKey => {
    const isNotStartWithON = !controllerKey.startsWith('on');
    if (isNotStartWithON) {
      throw new Error(`${controllerKey} 命名必须以 on 开头, 名词 + 动词结尾`);
    }
  });
  controllerKeys.forEach(controllerKey => {
    const controllerIsArray = Array.isArray(controller[controllerKey]);
    log(controller[controllerKey]);
    log(controllerIsArray);
    if (controllerIsArray) {
      controllerBind[controllerKey] = async (...args) => {
        rcsHooks.controller.beforeRunWithEnhancer(controllerKey, controller[controllerKey], callEffectContext.name, ...args);
        log(controller[controllerKey][1], callEffectContext);
        const result = await controller[controllerKey][1].call(callEffectContext, ...args);
        rcsHooks.controller.afterRunWithEnhancer(result, controllerKey);
        return result;
      };
    } else {
      controllerBind[controllerKey] = async (...args) => {
        rcsHooks.controller.beforeRun(controllerKey, callEffectContext.name, ...args);
        const result = await controller[controllerKey].call(callEffectContext, ...args);
        rcsHooks.controller.afterRun(result, controllerKey);
        return result;
      };
    }
  });
  return controllerBind;
}
