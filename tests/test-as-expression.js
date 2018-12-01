/**
 * @file tests/test-as-expression.js
 * @copyright 2018-present Karim Alibhai. All rights reserved.
 */

const { test } = require('ava')

const { transform } = require('./helpers')

test('should allow using function as expression (in assignment)', t => transform(t, `
let a = (function() { return Math.PI }())
t.is(a, Math.PI)

a = (function() { return Math.PI * 2 }())
t.is(a, Math.PI * 2)

t.is((function() { return Math.PI * 2 }()), Math.PI * 2)
`))

test('should allow using function as expression (in call expression)', t => transform(t, `
t.is((function() { return Math.PI * 2 }()), Math.PI * 2)
`))

test('should compress double iife', t => transform(t, `
const a = 50
const value = function(a){
  return function(b) {
    return a * b
  }
}(Math.PI)(2)

t.is(a, 50)
t.is(value, Math.PI * 2)
`))

test('should execute functions expressions in the right order (in array exp)', t => transform(t, `
let a = 5;
const b = [
  function() { a += 10; return 1 }(),
  function() { a *= 10; return 2 }(),
], c = [
  function() { a *= a; return 3 }(),
  function() { a /= 10; return 4 }(),
];

t.is(a, 2250)
t.deepEqual(b, [1, 2])
t.deepEqual(c, [3, 4])
`))

test('should execute functions expressions in the right order (in sequence exp)', t => transform(t, `
let a = 5;
(function() { a += 10; return 1 }()),
(function() { a *= 10; return 2 }()),
(function() { a *= a; return 3 }()),
(function() { a /= 10; return 4 }());

t.is(a, 2250)
`))

test('should execute functions expressions in the right order (in binary exp)', t => transform(t, `
let a = 5;
if ((function(){ a *= 5; return true }()) && (function(){ a += 5; return false }())) {
  a /= 10;
}
t.is(a, 30);
`))
