const babel = require('babel-core')
const { code } = babel.transform(`
  let a = 10

  ;(function () {
    let a = 0
    console.log(a + 1)
  }())

  console.log(a)
`, {
  babelrc: false,
  plugins: [
    require('./'),
  ],
})

console.log(code)
