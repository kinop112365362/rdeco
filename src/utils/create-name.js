export default function createName({ name, sid }) {
  let nextName = name
  if (sid) {
    nextName = `${name}_${sid}`
  }
  return nextName
}
