window.requestIdleCallback = jest.fn((x) => x())

class MessageChannel {
  constructor() {
    this.port1 = null
    this.prot2 = null
  }
}
window.MessageChannel = MessageChannel
