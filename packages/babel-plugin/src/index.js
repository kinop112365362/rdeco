/* eslint-disable no-unused-vars */
function createCDNPath({ appCode, configName, env, subEnv }) {
  const galaxDomain = 'https://d.17win.com/galaxy/configuration/'
  return `${galaxDomain}${appCode}/${env}/${subEnv}/${configName}.js`
}
module.exports = function ({ template }, { moduleMap }) {
  const buildImport = template(`
    import('SOURCE')
  `)
  const buildInject = template(`
    const PACKAGE_NAME = rdeco.inject(PACKAGE_NAME)
  `)
  return {
    visitor: {
      ImportDeclaration(fPath) {
        fPath.traverse({
          ImportSpecifier(path) {
            fPath.insertAfter(
              buildInject({ PACKAGE_NAME: path.node.imported.name })
            )
          },
          Literal(path) {
            if (path.node.value.includes('remote://')) {
              const realValue = path.node.value.split('remote://')[1]
              const [appCode, configName] = realValue.split('/')
              const { env, subEnv } = moduleMap[appCode][configName]
              const CDNPath = createCDNPath({
                appCode,
                configName,
                env,
                subEnv,
              })
              Object.keys(moduleMap).every((appCode) => {
                return Object.keys(moduleMap[appCode]).every((moduleName) => {
                  console.log(configName, appCode)
                  if (configName === moduleName) {
                    fPath.replaceWith(buildImport({ SOURCE: CDNPath }))
                    return true
                  }
                  return false
                })
              })
            }
          },
        })
      },
    },
  }
}
