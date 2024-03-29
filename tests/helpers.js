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
          if (path.parent.type === 'CallExpression' && path.parentPath.parent && path.parent.callee.type === 'FunctionExpression') {
            bHasIIFE = true
          }
        },
      },
    })],
  })

  return bHasIIFE
}

exports.transform  = function transform(t, code, opts) {
  const afterCode = babel.transform(code, {
    babelrc: false,
    plugins: [[require('../'), opts]],
  }).code

  // t.is(hasIIFE(code), true, 'should have at least one IIFE before transformation')
  eval(`(function(){${code}}());`)

  t.log(afterCode)
  eval(`(function(){${afterCode}}());`)
  t.not(afterCode.indexOf('t.'), -1, 'assertions should be kept')
  t.is(hasIIFE(afterCode), false, 'should have no IIFEs after transformation')
}
