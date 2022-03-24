const path = require('path')
const npmPackageJson = require('../package.json')

module.exports = {
  mode: 'development',
  entry: './src/index.umd.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: `${npmPackageJson.name}-${npmPackageJson.version}.development.js`,
  },
  devtool: 'eval-source-map',
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
}
