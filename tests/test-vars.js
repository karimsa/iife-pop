/**
 * @file tests/test-vars.js
 * @copyright 2018-present Karim Alibhai. All rights reserved.
 */

import test from 'ava'
import { evalTest } from './helpers'

test('should rename variables in iifee', t => {
  const scope = evalTest(`
    var a = "a"
    let b = "b"
    const c = "c"

    ;(function () {
      var a = "notA"
      let b = "notB"
      const c = "notC"

      push({
        a,
        b,
        c,
        aIsConst: canAssign(() => (a=a)),
        bIsConst: canAssign(() => (b=b)),
        cIsConst: canAssign(() => (c=c)),
      })
    }())

    push({
      a,
      b,
      c,
      aIsConst: canAssign(() => (a=a)),
      bIsConst: canAssign(() => (b=b)),
      cIsConst: canAssign(() => (c=c)),
    })
  `)
  t.log(scope.code)

  t.deepEqual(scope[0], {
    a: 'notA',
    b: 'notB',
    c: 'notC',
    aIsConst: false,
    bIsConst: false,
    cIsConst: true,
  }, `Incorrect scope from inner iife`)
  t.deepEqual(scope[1], {
    a: 'a',
    b: 'b',
    c: 'c',
    aIsConst: false,
    bIsConst: false,
    cIsConst: true,
  }, `Incorrect scope from caller`)
})

test('should rename variables in nested iifee', t => {
  const scope = evalTest(`
    var a = "a"
    let b = "b"
    const c = "c"

    ;(function () {
      var a = "nestedA"
      let b = "nestedB"
      const c = "nestedC"

      ;(function () {
        var a = "superNestedA"
        let b = "superNestedB"
        const c = "superNestedC"

        push({
          a,
          b,
          c,
          aIsConst: canAssign(() => (a=a)),
          bIsConst: canAssign(() => (b=b)),
          cIsConst: canAssign(() => (c=c)),
        })
      }())

      push({
        a,
        b,
        c,
        aIsConst: canAssign(() => (a=a)),
        bIsConst: canAssign(() => (b=b)),
        cIsConst: canAssign(() => (c=c)),
      })
    }())

    push({
      a,
      b,
      c,
      aIsConst: canAssign(() => (a=a)),
      bIsConst: canAssign(() => (b=b)),
      cIsConst: canAssign(() => (c=c)),
    })
  `)
  t.log(scope.code)

  t.deepEqual(scope[0], {
    a: 'superNestedA',
    b: 'superNestedB',
    c: 'superNestedC',
    aIsConst: false,
    bIsConst: false,
    cIsConst: true,
  }, `Incorrect scope from innermost iife`)
  t.deepEqual(scope[1], {
    a: 'nestedA',
    b: 'nestedB',
    c: 'nestedC',
    aIsConst: false,
    bIsConst: false,
    cIsConst: true,
  }, `Incorrect scope from inner iife`)
  t.deepEqual(scope[2], {
    a: 'a',
    b: 'b',
    c: 'c',
    aIsConst: false,
    bIsConst: false,
    cIsConst: true,
  }, `Incorrect scope from caller`)
})
