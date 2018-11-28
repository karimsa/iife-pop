/**
 * @file tests/test-return.js
 * @copyright 2018-present Karim Alibhai. All rights reserved.
 */

import test from 'ava'
import { evalTest } from './helpers'

/**

(function() { return VAL } ()) => VAL

(function(){
  if (unclear) {
    return A
  } else if (unclear) {
    return B
  }

  return C
}())

(function(){
  if (unclear) {
    return A
  } else if (unclear) {
    return B
  }

  if (unclear) {
    return C
  } else if (unclear) {
    return D
  }

  return E
}())

(function(){
  if (unclear) {
    return A
  } else if (unclear) {
    return B
  }

  BODY

  if (unclear) {
    return C
  } else if (unclear) {
    return D
  }

  BODY_2

  return E
}())

// Optimizing conditional returns (can't have an else block)

// 1) Inject return value variable at top & give it a value of UNSET (ptr to arbitrary memory).
// 2) Hoist logic out & replace "return XXX" with "_ret_val = XXX"
// 3) Rest of function should be "else" block

var UNSET = {};
var _ret_val = UNSET;

if (unclear) {
  _ret_val = A
} else if (unclear) {
  _ret_val = B
} else {
  BODY

  if (unclear) {
    _ret_val C
  } else if (unclear) {
    _ret_val D
  } else {
    BODY_2

    _ret_val E
  }
}

 */

test.only('should return single unconditional value from iife', async t => {
  const scope = evalTest(`
    push({
      retval: (function(){
        return 'test'
      }())
    })
  `)

  t.log(scope.code)
  t.is(scope.length, 1)
  t.deepEqual(scope[0], {
    retval: 'test',
  }, `Incorrect scope from iife`)
})
