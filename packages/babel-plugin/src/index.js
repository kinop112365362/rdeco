/* eslint-disable no-unused-vars */
module.exports = function ({ template }, { moduleMap }) {
  const buildImportLoadRemoteConfig = template(`
    import { loadRemoteConfig } from '@afe/browser-runtime-loader';
  `)
  const buildImport = template(`
    loadRemoteConfig({
      appCode: 'APPCODE',
      name: 'CONFIG_NAME',
      type: 'js',
    });
  `)
  const buildInject = template(`
    const PACKAGE_NAME = rdeco.inject(PACKAGE_NAME)
  `)
  let loadRemoteConfigIsReady = false
  return {
    visitor: {
      ImportDeclaration(fPath) {
        fPath.traverse({
          ImportSpecifier(path) {
            console.log(path.node.imported.name)
            fPath.insertAfter(
              buildInject({ PACKAGE_NAME: path.node.imported.name })
            )
            if (!loadRemoteConfigIsReady) {
              fPath.insertBefore(buildImportLoadRemoteConfig())
              loadRemoteConfigIsReady = true
            }
          },
          Literal(path) {
            if (path.node.value.includes('remote://')) {
              const realValue = path.node.value.split('remote://')[1]
              const [appCode, configName] = realValue.split('/')
              const configNames = moduleMap[appCode]
              const imports = []
              configNames.forEach((configName) => {
                imports.push(
                  buildImport({ APPCODE: appCode, CONFIG_NAME: configName })
                )
              })
              fPath.replaceWithMultiple(imports)
            }
          },
        })
      },
    },
    post() {
      loadRemoteConfigIsReady = null
    },
  }
}
