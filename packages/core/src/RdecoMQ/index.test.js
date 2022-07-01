import { RdecoMQ } from '.'

test('RdecoMQ size is 0', async () => {
  const mq = new RdecoMQ({
    size: 0,
  })
  mq.next('hello world')
  mq.subscribe({
    next(value) {
      expect(value).toBe('hello world')
    },
    error(e) {
      throw new Error(e)
    },
  })
})
