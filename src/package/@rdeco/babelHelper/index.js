/* eslint-disable no-unused-vars */
const path = require('path')
module.exports = function ({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path) {
        path.traverse({
          Literal(path) {
            if (path.node.value === '@rdeco/core') {
              path.replaceWith(t.stringLiteral('./src/package/@rdeco/core'))
            }
          },
        })
      },
    },
  }
}
