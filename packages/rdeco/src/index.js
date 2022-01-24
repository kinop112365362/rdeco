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
} from '@rdeco/core'
import {
  createComponent,
  withComponent,
  useComponent,
  Fallback,
  createFallback,
  Inject,
  InjectComponent,
  registerReactContext,
} from '@rdeco/react'

import { Router, RouteView, Redirect, App } from '@rdeco/router'
import { inject } from '@rdeco/module'
import * as emotion from '@emotion/react'
export const rdeco = {
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
  registerReactContext,
  Router,
  RouteView,
  Redirect,
  App,
  inject,
  emotion,
  registerModule,
}
export default rdeco
