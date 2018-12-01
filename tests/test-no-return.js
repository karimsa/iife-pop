/**
 * @file tests/no-return.js
 * @copyright 2018-present Karim Alibhai. All rights reserved.
 */

const { test } = require('ava')

const { transform } = require('./helpers')

test('should not overwrite variable from parent scope', t => transform(t, `
  let a = Math.PI;

  (function() {
    let a = Math.PI * 2
      , b = Math.PI * 3;

    t.is(a, Math.PI * 2);
    t.is(b, Math.PI * 3);
  }())

  t.is(a, Math.PI);
`))
