import { SyncHook, AsyncHook } from 'tapable'

export class Runner {
  constructor() {
    this.hooks = {
      run: new SyncHook(['methodName', 'methodParams']),
      runAsync: new AsyncHook(['methodName', 'methodParams']),
    }
  }
  beforeRun(methodName, methodParams) {
    this.hooks.run.call(methodName, methodParams)
  }
  beforeRunAsync(methodName, methodParams, callback) {
    this.hooks.runAsync.callAsync(methodName, methodParams, (err) => {
      if (err) return callback(err)
      callback(methodName, methodParams)
    })
  }
}
