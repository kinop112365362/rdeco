type configType = {
  name:string,
  state?:any,
  exports?:{
    [key:string]:(this:any)=>any
  }
  subscribe?:{
    [key:string]:{
      [key:string]:(this:any)=>any
    }
  }
  service?:{
    [key:string]:(this:any)=>any
  }
  controller?:{
    [key:string]:(this:any)=>any
  }
  view:{
    render:(this:any)=>any
    [key:string]:(this:any)=>any
  }
}
type createComponentType = (config:configType) => any

export const enhanceContext: any
export const create: any
export const createMembrane: any
export const invoke: any
export const readState: any
export const namelist: any
export const configModuleLoader: any
export const createComponent: createComponentType
export const createReqComponent: createComponentType
export const withComponent: any
export const useComponent: any
export const Fallback: any
export const createFallback: any
export const Inject: any
export const InjectComponent: any
export const registerReactContext: any
export const Router: any
export const RouteView: any
export const Redirect: any
export const App: any
export const inject: any
export const emotion: any
export const registerModule: any
export const compose: any
export const createCompose: any
export const req: any
export const ReqComponent: any
export const ReqApp: any
export const installHooks: any

