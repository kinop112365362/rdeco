module.exports = {
  plugins: [
    [
      '../src/index.js',
      {
        scope: {
          appCode: 'hrss-component',
          configName: 'hrss-data-model',
        },
      },
    ],
  ],
}
