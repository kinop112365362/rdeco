import {
  enhanceContext,
  create,
  createMembrane,
  invoke,
  readState,
  namelist,
  configModuleLoader,
} from './package/@rdeco/core/index'
import {
  createComponent,
  withComponent,
  useComponent,
  Fallback,
  createFallback,
  Inject,
  registerReactContext,
} from './package/@rdeco/react'

import { Router, RouteView, App } from './package/@rdeco/router5'
import { inject } from './package/@rdeco/module'
import * as emotion from '@emotion/react'

export {
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
  registerReactContext,
  Router,
  RouteView,
  App,
  inject,
  emotion,
}

// if (window) {
//   if (window.rdeco) {
//     console.error(`当前环境存在多个版本的 rdeco，请检查是否意外引入了 rdeco 包`)
//   }
//   window.rdeco = {
//     core: {
//       enhanceContext,
//       create,
//       createMembrane,
//       invoke,
//       readState,
//       namelist,
//       configModuleLoader,
//     },
//     react: {
//       createComponent,
//       withComponent,
//       useComponent,
//       Fallback,
//       createFallback,
//       Inject,
//       registerReactContext,
//     },
//     router5: {
//       Router,
//       RouteView,
//       App,
//     },
//     module: {
//       inject,
//     },
//     emotion,
//   }
// }
