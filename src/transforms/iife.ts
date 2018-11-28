/**
 * @file src/transforms/iife.ts
 * @copyright 2018-present Foko Inc. All rights reserved.
 */

import { NodePath } from 'babel-traverse'
import {
  CallExpression,
  FunctionExpression,
  VariableDeclarator,
  isIdentifier,
  ReturnStatement,
} from 'babel-types'
import generate from 'babel-generator'

import createDebug = require('debug')
const debug = createDebug('iife-pop')

export interface IIFENode extends CallExpression {
  callee: FunctionExpression
}

export function IIFE(path: NodePath<IIFENode>) {
  debug('Found IIFE => %o', path.node.callee)

  const visitedIds: { [key: string]: boolean } = {}

  path.traverse({
    VariableDeclarator(childPath: NodePath<VariableDeclarator>) {
      if (isIdentifier(childPath.node.id)) {
        const oldName = childPath.node.id.name
        if (visitedIds[oldName]) return
        visitedIds[oldName] = true

        if (childPath.scope.hasOwnBinding(oldName)) {
          const id = path.scope.generateUidIdentifier(oldName)
          debug('Renaming: %o -> %o', oldName, id.name)
          childPath.scope.rename(oldName, id.name)
          childPath.skip()
          return
        }
      }

      throw new Error(`Not sure what to do with a ${childPath.node.id.type} id`)
    },
  })

  path.replaceWithMultiple(path.node.callee.body.body)
}
