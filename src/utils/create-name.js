import { v4 as uuidv4 } from 'uuid'
export default function createName(name) {
  const nextName = `${name}_${uuidv4()}`
  console.debug(nextName)
  return nextName
}
