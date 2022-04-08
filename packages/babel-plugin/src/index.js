/* eslint-disable no-unused-vars */
// const kebabcase = require('lodash.kebabcase')

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
          StringLiteral(SLPath) {
            if (/^@scope/.test(SLPath.node.value)) {
              SLPath.replaceWith(
                buildRealModuleName({
                  MODULE_NAME: `@${scope.appCode}/${scope.configName}/${
                    SLPath.node.value.split('/')[1]
                  }`,
                })
              )
              SLPath.node.isHandled = true
            }
          },
        })
        // CEPath.traverse({
        //   Identifier(IPath) {
        // CEPath.traverse({
        //   ObjectExpression(OEPath) {
        //     OEPath.traverse({
        //       ObjectProperty(OPPath) {
        //         OPPath.traverse({
        //           Identifier(I1Path) {
        //             OPPath.traverse({

        //             })
        //           },
        //         })
        //       },
        //     })
        //   },
        // })

        // if (IPath.node.name === 'req') {
        //   CEPath.traverse({
        //     StringLiteral(SLPath) {
        //       if (/^@scope/.test(SLPath.node.value)) {
        //         SLPath.replaceWith(
        //           buildRealModuleName({
        //             MODULE_NAME: `@${scope.appCode}/${scope.configName}/${
        //               SLPath.node.value.split('/')[1]
        //             }`,
        //           })
        //         )
        //         SLPath.node.isHandled = true
        //       }
        //     },
        //   })
        // }
        //   },
        // })
      },
    },
  }
}
