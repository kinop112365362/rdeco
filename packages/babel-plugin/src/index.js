/* eslint-disable no-unused-vars */
const kebabcase = require('lodash.kebabcase')

module.exports = function ({ template, types: t }, { externals, entry }) {
  let externalsModuleNames = []
  let externalsKeys = []
  let externalsModule = []
  Object.keys(externals).forEach((externalKey) => {
    externalsModuleNames.push([externalKey, externals[externalKey]])
    externalsModule.push(externals[externalKey])
    externalsKeys.push(externalKey)
  })
  const buildRealModuleName = template(`
    'APPCODE-CONFIG_NAME/MODULE_NAME'
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
                                SLPath.replaceWith(
                                  buildRealModuleName({
                                    APPCODE: '@hrss-component',
                                    CONFIG_NAME: 'hrss-data-model',
                                    MODULE_NAME: SLPath.node.value,
                                  })
                                )
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
        externalsModule.forEach((module) => {
          if (module === IDPath.node.source.value && IDPath.node.loc) {
            throw IDPath.buildCodeFrameError(
              '定义为 entry 的入口文件, 不能直接引用定义在 externals 里的模块'
            )
          }
        })
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
              if (state.file.opts.filename.includes(entry)) {
                externalsKeys.forEach((KEY) => {
                  IDPath.insertAfter(buildExternalsKey({ KEY }))
                })
                rdecoModules.forEach((rdecoModuleTemplate) => {
                  IDPath.insertAfter(rdecoModuleTemplate)
                })
              }

              // -->
              if (!loadRemoteConfigIsReady && rdecoModules.length > 0) {
                IDPath.insertAfter(buildImportLoadRemoteConfig())
                loadRemoteConfigIsReady = true
              }
              // 挂载 window key
              if (state.file.opts.filename.includes(entry)) {
                externalsModuleNames.forEach((data) => {
                  const [KEY, MODULE] = data
                  IDPath.insertAfter(buildExternals({ KEY, MODULE }))
                })
              }
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
      externalsKeys = null
      externalsModuleNames = null
      externalsModule = null
    },
  }
}
