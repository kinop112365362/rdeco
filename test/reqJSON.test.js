import { reqJSON } from '@rdeco/web-app-sdk'
window.__GALAXY_CONFIG_ENV__ = {
  envName: 'dev',
  subEnvName: 'servyou-dev',
}
test('reqJSON test', async () => {
  const data = await reqJSON('@hrss-component/biz-overview-router-config')
  console.debug(data)
})
