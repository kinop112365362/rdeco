import {
  getRouterConfig,
  pathToName,
} from '../src/package/@rdeco/router5/utils'

describe('测试 router utils', () => {
  it('getRouterConfig', async () => {
    expect(getRouterConfig()).toMatchObject({
      router5Option: { allowNotFound: true },
      beforeDone: null,
      browserPluginOption: { useHash: true },
      loggerPluginEnable: false,
    })

    expect(
      getRouterConfig({
        router5Option: { allowNotFound: false },
        browserPluginOption: { useHash: false },
      })
    ).toMatchObject({
      router5Option: { allowNotFound: false },
      beforeDone: null,
      browserPluginOption: { useHash: false },
      loggerPluginEnable: false,
    })
  })

  it('pathToName', async () => {
    expect(pathToName()).toBe('')

    expect(pathToName('/')).toBe('/')

    expect(pathToName('/home')).toBe('home')

    expect(pathToName('/home/page/page1')).toBe('homePagePage1')
  })
})
