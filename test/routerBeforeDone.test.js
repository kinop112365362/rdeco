import { beforeDoneMiddleware } from '../packages/router5/beforMiddleware'

describe('测试 beforeDoneMiddleware', () => {
  it('intercept done', async () => {
    let flag = 'before'
    const fn = beforeDoneMiddleware(() => {
      flag = 'beforeDone'
    })
    fn()(null, null, () => {
      flag = 'done'
    })

    expect(flag).toContain('beforeDone')
  })

  it('intercept and perform done', async () => {
    let flag = 'before'
    const fn = beforeDoneMiddleware((toState, fromState, done) => {
      flag = 'beforeDone'
      done()
    })
    fn()(null, null, () => {
      flag = 'done'
    })

    expect(flag).toContain('done')
  })

  it('not intercept', async () => {
    let flag = 'before'
    const fn = beforeDoneMiddleware()
    fn()(null, null, () => {
      flag = 'done'
    })

    expect(flag).toContain('done')
  })
})
