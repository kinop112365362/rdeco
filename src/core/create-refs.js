import { useRef } from 'react'

export function createRefs(refsKeys, refs) {
  const refContext = {}
  if (refsKeys) {
    refsKeys.forEach((refKey) => {
      refContext[refKey] = useRef(refs[refKey])
    })
  }
  return refContext
}
