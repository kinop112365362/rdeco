import pick from 'object.pick'
import omit from 'object.omit'

export function membraneIs({
  membraneObject,
  bindPropsKeys,
  extraContext,
  omitKeys,
}) {
  const protectedObject = omit(membraneObject, 'membrane')
  const membrane = { ...membraneObject.membrane }
  const superContext = {
    ...omit(protectedObject, omitKeys),
    ...extraContext,
  }
  bindPropsKeys.forEach((key) => {
    for (const methodKey in membrane[key]) {
      if (Object.hasOwnProperty.call(membrane[key], methodKey)) {
        const method = membrane[key][methodKey]
        membrane[key][methodKey] = method.bind(superContext)
      }
    }
  })
  const protectedObjectKeys = Object.Keys(protectedObject)
  const membraneInObject = { ...protectedObject, ...membraneObject }
  const exportObject = pick(membraneInObject, protectedObjectKeys)
  return exportObject
}
