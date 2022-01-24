module.exports = {
  plugins: [
    [
      '../src/index.js',
      {
        moduleMap: {
          'hrss-component': {
            'hrss-data-model': {
              env: 'dev',
              subEnv: 'servouy-dev',
            },
          },
        },
      },
    ],
  ],
}
