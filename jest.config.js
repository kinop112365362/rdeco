const defaults = {
  coverageDirectory: './coverage/',
  collectCoverage: true,
  testURL: 'http://localhost',
}

const standardConfig = {
  ...defaults,
  displayName: 'ReactDOM',
}

module.exports = {
  projects: [standardConfig],
}
