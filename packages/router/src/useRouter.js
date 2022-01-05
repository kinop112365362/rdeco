import { useContext } from 'react'
import RouterContext from './RouterContext'
function useRouter() {
  return useContext(RouterContext)
}

export { useRouter }
