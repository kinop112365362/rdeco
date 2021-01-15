import { log } from '../utils/log'
// 暂时废弃
export const membrane = {}
export const createMembrane = (membraneMeta) => {
  log(membraneMeta, 3)
  membrane[membraneMeta.name] = membraneMeta
}
