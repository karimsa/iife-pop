/**
 * @file src/index.ts
 * @copyright 2018-present Karim Alibhai. All rights reserved.
 */

import { NodePath } from 'babel-traverse'
import { CallExpression, isFunctionExpression } from 'babel-types'

import { IIFE, IIFENode } from './transforms'

export = () => ({
  visitor: {
    CallExpression(path: NodePath<CallExpression>) {
      if (isFunctionExpression(path.node.callee)) {
        IIFE(<NodePath<IIFENode>>path)
      }
    }
  }
})
