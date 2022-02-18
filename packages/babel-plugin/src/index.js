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
  return {
    visitor: {
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
                        Identifier(I1Path) {
                          if (I1Path.node.name === 'name') {
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
              if (!loadRemoteConfigIsReady) {
                IDPath.insertBefore(buildImportLoadRemoteConfig())
                loadRemoteConfigIsReady = true
              }

              if (IDPath.node.specifiers) {
                IDPath.node.specifiers.forEach((node) => {
                  IDPath.insertAfter(
                    buildInject({
                      PACKAGE_NAME: `@${appCode}-${configName}/${kebabcase(
                        node.imported.name
                      )}`,
                      VAR: node.imported.name,
                    })
                  )
                })
              }
              IDPath.replaceWith(
                buildImport({ APPCODE: appCode, CONFIG_NAME: configName })
              )
            }
          },
        })
      },
    },
  }
}
