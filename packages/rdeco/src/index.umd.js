// todo 这个改成package包形式的依赖，不直接使用源码？？？

import {
  enhanceContext,
  create,
  createMembrane,
  invoke,
  readState,
  namelist,
  configModuleLoader,
  registerModule,
  task,
  mock,
} from '@rdeco/core'
import {
  createComponent,
  withComponent,
  useComponent,
  Fallback,
  createFallback,
  Inject,
  InjectComponent,
  ReqComponent,
  registerReactContext,
} from '@rdeco/react'

import { Router, RouteView, Redirect, App } from '@rdeco/router'
import { inject, req } from '@rdeco/module'
window.rdeco = {
  enhanceContext,
  create,
  createMembrane,
  invoke,
  readState,
  namelist,
  configModuleLoader,
  createComponent,
  withComponent,
  useComponent,
  Fallback,
  createFallback,
  Inject,
  InjectComponent,
  ReqComponent,
  registerReactContext,
  Router,
  RouteView,
  Redirect,
  App,
  inject,
  registerModule,
  req,
  task,
  mock,
}
