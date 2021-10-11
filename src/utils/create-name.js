import { v4 as uuidv4 } from 'uuid'
export default function createName(name) {
  return `${name}_${uuidv4()}`
}
