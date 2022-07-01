function _consumeValue(value) {
  this.observerList.forEach((observer) => {
    try {
      observer.next(value)
    } catch (error) {
      observer.error(error)
    }
  })
}

export class RdecoMQ {
  constructor(config) {
    this.size = config.size
    this.valueList = []
    this.observerList = []
  }
  subscribe(observer) {
    this.valueList.forEach((value) => {
      try {
        observer.next(value)
      } catch (error) {
        observer.error(error)
      }
    })
    const symbol = window.Symbol()
    observer.symbol = symbol
    this.observerList.push(observer)
    return () => {
      this.observerList = this.observerList.filter((filterObserver) => {
        filterObserver.symbol !== symbol
      })
    }
  }
  next(value) {
    if (this.size === 0) {
      _consumeValue.call(this, value)
    }
    if (this.size === 1) {
      this.valueList[0] = value
      _consumeValue.call(this, value)
    }
    if (this.size > 1) {
      if (this.valueList.length <= this.size) {
        this.valueList.push(value)
        this.valueList.forEach((value) => {
          _consumeValue.call(this, value)
        })
      } else {
        this.valueList.shift()
        this.valueList.push(value)
      }
    }
  }
}
