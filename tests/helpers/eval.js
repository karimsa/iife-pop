/**
 * @file tests/helpers/eval.js
 * @copyright 2018-present Karim Alibhai. All rights reserved.
 */

import { transform } from 'babel-core'
import { isFunctionExpression } from 'babel-types'
import { createContext, runInNewContext } from 'vm'

function assertNoIife(code) {
  transform(code, {
    babelrc: false,
    plugins: [
      {
        visitor: {
          CallExpression(path) {
            if (isFunctionExpression(path.node.callee)) {
              console.log(path.node)
              throw new Error('There is an unpopped iife')
            }
          }
        }
      }
    ],
  })
}

export function evalTest(code, sandbox = {}) {
  const newCode = transform(`
    function factory() {
      ${code}
    }
  `, {
    babelrc: false,
    plugins: [require('../../')],
  }).code

  const scope = []
  scope.code = newCode

  Object.assign(sandbox, {
    scope,
    push(val) {
      scope.push(val)
    },
    canAssign(fn) {
      try {
        fn()
        return false
      } catch (err) {
        if (String(err).indexOf('Assignment to constant variable') === -1) {
          throw err
        }
        return true
      }
    },
  })

  assertNoIife(newCode)
  runInNewContext(`
    ${newCode}
    factory()
  `, sandbox)

  return scope
}
