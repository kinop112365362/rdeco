import { createControllerBind } from './create-controller-bind'
import { createServiceBind } from './create-service-bind'
import { createViewBind } from './create-view-bind'

export function createStoreBindContext(
  context,
  { name, service, controller, view },
  { rc, refs, state },
  superBindContext,
  props
) {
  const getViewContext = (controllerBind) => ({
    controller: controllerBind,
    state,
    refs,
    context,
    props,
    view,
  })
  const callServiceContext = {
    name,
    state,
    refs,
    context,
    props,
  }
  if (superBindContext) {
    callServiceContext.super = {
      service: superBindContext.service,
    }
    const serviceBind = createServiceBind(
      service,
      Object.freeze(callServiceContext)
    )
    callServiceContext.super.controller = superBindContext.controller
    const controllerBind = createControllerBind(
      controller,
      Object.freeze({
        ...callServiceContext,
        service: serviceBind,
        rc,
      })
    )
    const callViewContext = getViewContext(controllerBind)
    callViewContext.controller = controllerBind
    callViewContext.super = {
      view: superBindContext.view,
      controller: superBindContext.controller,
    }
    const viewBind = createViewBind(view, Object.freeze(callViewContext))
    return Object.freeze({
      state,
      refs,
      controller: { ...superBindContext.controller, ...controllerBind },
      view: { ...superBindContext.view, ...viewBind },
    })
  }
  const serviceBind = createServiceBind(
    service,
    Object.freeze(callServiceContext)
  )
  const controllerBind = createControllerBind(
    controller,
    Object.freeze({
      ...callServiceContext,
      service: serviceBind,
      rc,
    })
  )
  const viewBind = createViewBind(
    view,
    Object.freeze(getViewContext(controllerBind))
  )
  return Object.freeze({
    rc,
    service: serviceBind,
    state,
    refs,
    controller: controllerBind,
    view: viewBind,
  })
}
