/* eslint-disable no-unused-vars */
const kebabcase = require('lodash.kebabcase')

module.exports = function ({ template, types: t }, option) {
  const { scope = null } = option
  const buildRealModuleName = template(`
    'MODULE_NAME'
  `)
  const buildExternals = template(`
    import * as KEY from 'MODULE'
  `)
  const buildExternalsKey = template(`
    window.KEY = KEY
  `)
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
    const VAR = rdeco.inject('PACKAGE_NAME')
  `)
  let loadRemoteConfigIsReady = false
  let lastImportDeclarationNode = null
  let injectNames = []
  let rdecoModules = []
  return {
    visitor: {
      Program(path) {
        for (let index = 0; index < path.node.body.length; index++) {
          if (path.node.body[index].type !== 'ImportDeclaration') {
            lastImportDeclarationNode = path.node.body[index - 1]
            break
          }
        }
      },
      CallExpression(CEPath) {
        CEPath.traverse({
          Identifier(IPath) {
            if (
              IPath.node.name === 'createComponent' ||
              IPath.node.name === 'create'
            ) {
              CEPath.traverse({
                ObjectExpression(OEPath) {
                  OEPath.traverse({
                    ObjectProperty(OPPath) {
                      OPPath.traverse({
                        Identifier(IPath) {
                          if (IPath.node.name === 'name') {
                            OPPath.traverse({
                              StringLiteral(SLPath) {
                                if (!SLPath.node.value.includes('@')) {
                                  SLPath.replaceWith(
                                    buildRealModuleName({
                                      MODULE_NAME: `@${scope.appCode}-${
                                        scope.configName
                                      }/${kebabcase(SLPath.node.value)}`,
                                    })
                                  )
                                }
                              },
                            })
                          }
                        },
                      })
                    },
                  })
                },
              })
            }
          },
        })
      },
      ImportDeclaration(IDPath, state) {
        IDPath.traverse({
          StringLiteral(LPath) {
            if (LPath.node.value.includes('remote://')) {
              const realValue = LPath.node.value.split('remote://')[1]
              const [appCode, configName] = realValue.split('/')

              rdecoModules.push(
                buildImport({ APPCODE: appCode, CONFIG_NAME: configName })
              )
              IDPath.traverse({
                ImportSpecifier(ISPath) {
                  injectNames.push([
                    `@${appCode}-${configName}/${kebabcase(
                      ISPath.node.imported.name
                    )}`,
                    ISPath.node.imported.name,
                  ])
                },
              })
              IDPath.remove()
            }
            if (LPath.node.value === lastImportDeclarationNode.source.value) {
              injectNames.forEach((data) => {
                const [packageName, varName] = data
                IDPath.insertAfter(
                  buildInject({
                    PACKAGE_NAME: packageName,
                    VAR: varName,
                  })
                )
              })
              // import externals
              // if (
              //   entry.find((entryPath) =>
              //     state.file.opts.filename.includes(entryPath)
              //   )
              // ) {
              //   externalsKeys.forEach((KEY) => {
              //     IDPath.insertAfter(buildExternalsKey({ KEY }))
              //   })
              // }
              rdecoModules.forEach((rdecoModuleTemplate) => {
                IDPath.insertAfter(rdecoModuleTemplate)
              })
              // -->
              if (!loadRemoteConfigIsReady && rdecoModules.length > 0) {
                IDPath.insertAfter(buildImportLoadRemoteConfig())
                loadRemoteConfigIsReady = true
              }
              // 挂载 window key
              // if (
              //   entry.find((entryPath) =>
              //     state.file.opts.filename.includes(entryPath)
              //   )
              // ) {
              //   externalsModuleNames.forEach((data) => {
              //     const [KEY, MODULE] = data
              //     IDPath.insertAfter(buildExternals({ KEY, MODULE }))
              //   })
              // }
              // -->
            }
          },
        })
      },
    },
    post() {
      loadRemoteConfigIsReady = null
      lastImportDeclarationNode = null
      injectNames = null
      rdecoModules = null
      // externalsKeys = null
      // externalsModuleNames = null
      // externalsModule = null
    },
  }
}
