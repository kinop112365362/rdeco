import { enhanceContext } from '../store/combination'
enhanceContext('task', {
  id: 0,
  body: {},
  create() {
    this.id++
    return this.id
  },
  add(id, timer) {
    if (!this.body[id]) {
      this.body[id] = []
    }
    this.body[id].push(timer)
  },
  clear(
    id,
    callback = (timer) => {
      clearInterval(timer)
    }
  ) {
    this.body[id].forEach((timer) => {
      callback(timer)
    })
  },
})
