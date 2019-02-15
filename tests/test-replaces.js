/**
 * @file tests/test-replaces.js
 * @copyright 2019-present NxtGenDevs Inc. All rights reserved.
 */

import { test } from 'ava'

import { transform } from './helpers'

test.only('should replace given functions with IIFEs', async t => transform(t, `
function test(arg) {
	return \`Hello, \${arg}\`
}

t.is(test('world'), 'Hello, world')
`, {
	replace_fns: ['test'],
}))
