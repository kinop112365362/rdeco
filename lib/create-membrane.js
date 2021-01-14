import { log } from './utils/log';

export const membrane = {};
export const createMembrane = membraneMeta => {
  log(membraneMeta, 3);
  membrane[membraneMeta.name] = membraneMeta;
};