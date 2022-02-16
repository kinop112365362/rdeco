module.exports = {
  plugins: [
    [
      '../src/index.js',
      {
        moduleMap: {
          'hrss-component': ['hrss-data-model', 'hrss-view-model'],
        },
        externals: {
          rdeco: '@rdeco/web-app-sdk',
          dplReact: 'dpl-react',
          axios: 'axios',
        },
      },
    ],
  ],
}
