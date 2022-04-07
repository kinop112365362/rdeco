module.exports = {
  presets: ['@babel/preset-react'],
  plugins: [
    [
      '../src/index.js',
      {
        scope: {
          appCode: 'hrss-component',
          configName: 'data-model',
        },
      },
    ],
  ],
}
