module.exports = {
  plugins: [
    [
      '../src/index.js',
      {
        externals: {
          // rdeco: '@rdeco/web-app-sdk',
          dplReact: 'dpl-react',
          axios: 'axios',
        },
        entry: '/test/index.js',
      },
    ],
  ],
}
