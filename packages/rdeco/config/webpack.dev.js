const path = require('path')
const npmPackageJson = require('../package.json')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: `${npmPackageJson.name}-${npmPackageJson.version}.development.js`,
  },
  externals: ['react', 'react-dom'],
}
