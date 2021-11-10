import {
  getRouterConfig,
  pathToName,
  getPath,
  handlePath
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

  it('getPath', async () => {
    expect(getPath()).toBe('/')
    expect(getPath('', '/')).toBe('/')
    expect(getPath('', '//')).toBe('/')
    expect(getPath('', '//home')).toBe('/home')
    expect(getPath('', '/home//page/page1/')).toBe('/home/page/page1')
    expect(getPath('', '/home//')).toBe('/home')
    expect(getPath('', 'home//')).toBe('/home')
    expect(getPath('/', 'home//')).toBe('/home')
    expect(getPath('index', 'home//')).toBe('/index/home')
    expect(getPath('/index', 'home//')).toBe('/index/home')
    expect(getPath('//index', 'home//')).toBe('/index/home')
    expect(getPath('//index/', 'home//')).toBe('/index/home')
    expect(getPath('//index//', 'home//')).toBe('/index/home')
    expect(getPath('//index///xx///', 'home//')).toBe('/index/xx/home')
    expect(() => getPath('/home', '/')).toThrow(
      new Error("RouteView props path Can't be nul and '/'")
    )
    expect(() => getPath('/home', '')).toThrow(
      new Error("RouteView props path Can't be nul and '/'")
    )
    expect(() => getPath('/', '')).toThrow(
      new Error("RouteView props path Can't be nul and '/'")
    )
  })

  it('handlePath', async () => {
    expect(handlePath()).toBe('')
    expect(handlePath('/')).toBe('/')
    expect(handlePath('/?a=1')).toBe('/')
    expect(handlePath('/home?a=1&cc=22')).toBe('/home')
  })
})
