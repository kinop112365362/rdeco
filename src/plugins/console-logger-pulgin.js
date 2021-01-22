export class ConsoleLoggerPlugin {
  constructor(debug) {
    this.debug = debug
  }
  logGroup(key, info, storeName, args) {
    console.group(`${storeName}.${key}`)
    const arg = args.length > 0 ? args : ['没有入参']
    if (info) {
      console.debug(`说明: ${info} 入参:`, ...arg)
    } else {
      console.debug('入参:', ...arg)
    }
    console.groupEnd()
  }
  apply(runner) {
    if (!this.debug) {
      return
    }
    runner.hook.beforeRun.tap(
      'ConsoleLoggerPlugin',
      (key, info, storeName, args) => {
        this.logGroup(key, info, storeName, args)
      }
    )
  }
}
