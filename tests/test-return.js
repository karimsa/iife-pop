/**
 * @file tests/test-return.js
 * @copyright 2018-present Karim Alibhai. All rights reserved.
 */

import test from 'ava'
import { evalTest } from './helpers'

test('should return single unconditional value from iife', async t => {
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
