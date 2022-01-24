module.exports = function ({ template }, { moduleMap }) {
  const buildInject = template(`
    import('SOURCE')
  `)
  return {
    visitor: {
      ImportDeclaration(fPath) {
        fPath.traverse({
          Literal(path) {
            Object.keys(moduleMap).every((value) => {
              if (path.node.value === value) {
                fPath.replaceWith(buildInject({ SOURCE: moduleMap[value] }))
                return true
              }
              return false
            })
          },
        })
      },
    },
  }
}
