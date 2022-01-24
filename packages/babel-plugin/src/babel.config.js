module.exports = {
  plugins: [
    [
      './index.js',
      {
        moduleMap: {
          socins: 'http://localhost:3000/assets/lib.js',
        },
      },
    ],
  ],
}
