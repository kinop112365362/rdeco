const defaults = {
  coverageDirectory: './coverage/',
  collectCoverage: true,
  testURL: 'http://localhost',
  setupFiles: ['./jestSetup.js'],
  transformIgnorePatterns: ['/node_modules/@afe/browsr-runtime-loader'],
}

const standardConfig = {
  ...defaults,
  displayName: 'ReactDOM',
}

module.exports = {
  projects: [standardConfig],
  testRegex: '/__test__/.+\\.test\\.ts$',
  roots: ['packages/'],
}
