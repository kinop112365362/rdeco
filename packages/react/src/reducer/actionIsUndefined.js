export function actionIsUndefined(reducerModel, action) {
  if (reducerModel[action[0]] === undefined) {
    throw new Error(`不存在的 action => ${action[0]}, 清核对代码`)
  }
}
