import { createRC } from './reducer-utils';
import { createControllerBind } from './create-controller-bind';
import { createServiceBind } from './create-service-bind';
import { createRefs } from './create-refs';
import { createViewBind } from './create-view-bind';

export function createStoreInHook({ stateKeys, dispatch, state, refKeys, ref, name, context, service, controller, view }) {
  const rc = createRC(stateKeys, dispatch, state);
  const refs = createRefs(refKeys, ref);
  const callEffectContext = {
    name,
    rc,
    state,
    refs,
    context,
  };
  const serviceContext = createServiceBind(service, Object.freeze(callEffectContext));
  const controllerBind = createControllerBind(controller, Object.freeze({ ...callEffectContext, service: serviceContext }));
  const viewBind = createViewBind(view, Object.freeze({
    controller: controllerBind,
    state,
    refs,
    context
  }));
  return Object.freeze({
    state,
    refs,
    controller: controllerBind,
    view: viewBind
  });
}
