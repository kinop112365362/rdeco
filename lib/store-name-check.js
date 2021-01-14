import { storeNameList } from './store-name-list';

export function storeNameCheck(name) {
  if (storeNameList.includes(name)) {
    console.error(`${name} 已经被其他 store 使用了, 请重新配置`);
  }
  if (name === undefined) {
    throw new Error('配置 store 必须配置 name 字段');
  } else {
    storeNameList.push(name);
  }
}
