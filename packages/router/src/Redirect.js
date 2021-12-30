import { useContext } from 'react'
import { createComponent } from '@rdeco/react'
import { getPath, handlePath, matchPath, pathToName } from './utils'
import RouterContext from './RouterContext'

const Redirect = createComponent({
  name: '@rdeco/router5-redirect',
  ref: {
    parentPath: '',
  },
  router: {
    before({ toState, done }, next) {
      const parentPath = this.ref.parentPath
      const { forwardTo, exact, defaultParams } = this.props
      const path = handlePath(this.props.path || '/')
      const toStatePath = handlePath(toState.path)
      const currentPath = getPath(parentPath, path)

      if (matchPath(currentPath, toStatePath, exact)) {
        setTimeout(() => {
          this.context.router.navigate(forwardTo, defaultParams)
        }, 0)
      }

      next(done)
    },
  },
  view: {
    render() {
      const { forwardTo } = this.props
      if (!this.props.forwardTo || !this.props.path) {
        throw new Error('forwardTo or path is null')
      }
      const routerContext = useContext(RouterContext) || { parentPath: '' }
      const parentPath = routerContext.parentPath
      const path = pathToName(handlePath(this.props.path || '/'))
      const currentPath = getPath(parentPath, path)
      const routeName = pathToName(currentPath)
      const forwardToRouteName = pathToName(handlePath(forwardTo || '/'))
      const { canActivate, defaultParams, encodeParams, decodeParams } =
        this.props
      this.ref.parentPath = parentPath

      if (!this.context.router.matchPath(currentPath)) {
        this.context.router.add({
          name: routeName,
          path: currentPath,
          forwardTo: forwardToRouteName,
          canActivate,
          defaultParams,
          encodeParams,
          decodeParams,
        })
      }

      return null
    },
  },
})

export default Redirect
