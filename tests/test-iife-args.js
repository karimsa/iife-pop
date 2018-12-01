/**
 * @file tests/no-return.js
 * @copyright 2018-present Karim Alibhai. All rights reserved.
 */

const { test } = require('ava')

const { transform } = require('./helpers')

test('should maintain iife args', t => transform(t, `
  let a = Math.PI;

  (function(a, b) {
    t.is(a, Math.PI * 2);
    t.is(b, Math.PI * 3);
  }(Math.PI * 2, Math.PI * 3))

  t.is(a, Math.PI);
`))
