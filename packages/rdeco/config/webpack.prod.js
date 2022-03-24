const path = require('path')
const npmPackageJson = require('../package.json')

module.exports = {
  mode: 'production',
  entry: './src/index.umd.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: `${npmPackageJson.name}-${npmPackageJson.version}.production.js`,
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
}
