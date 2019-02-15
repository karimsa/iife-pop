/**
 * @file tests/no-return.js
 * @copyright 2018-present Karim Alibhai. All rights reserved.
 */

const { test } = require('ava')

const { transform } = require('./helpers')

test('should throw errors through iife', t => transform(t, `
	t.throws(function() {
		(function(arg){
			throw new Error(\`Hello, \${arg}\`)
		}('world'))
	}, /Hello, world/)
`))
