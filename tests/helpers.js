/**
 * @file tests/helpers.js
 * @copyright 2018-present Karim Alibhai. All rights reserved.
 */

const babel = require('@babel/core')

function hasIIFE(code) {
  let bHasIIFE = false

  babel.transform(code, {
    babelrc: false,
    plugins: [() => ({
      visitor: {
        FunctionExpression(path) {
          if (path.parent.type === 'CallExpression') {
            bHasIIFE = true
          }
        },
      },
    })],
  })

  return bHasIIFE
}

exports.transform  = function transform(t, code) {
  const afterCode = babel.transform(code, {
    babelrc: false,
    plugins: [require('../')],
  }).code

  t.is(hasIIFE(code), true, 'should have at least one IIFE before transformation')
  eval(`(function(){${code}}());`)

  t.log(afterCode)
  eval(`(function(){${afterCode}}());`)
  t.not(afterCode.indexOf('t.'), -1, 'assertions should be kept')
  t.is(hasIIFE(afterCode), false, 'should have no IIFEs after transformation')
}
