import { createReducer } from '../lib/reducer-utils';


test('测试 createReducer 处理数组类型的 payload, 进行了 map 处理', () => {
  const stateKeys = ['nameList'];
  const reducer = createReducer(stateKeys)({ });
  const originArray = ['jack'];
  const array = reducer.setNameList(originArray);
  const isEqual = originArray === array;
  expect(isEqual).toBe(false);
});