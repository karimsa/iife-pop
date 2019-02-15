/**
 * @file src/index.ts
 * @copyright 2018-present Karim Alibhai. All rights reserved.
 */

import { Visitor } from '@babel/core'
import {
  NodePath,
} from '@babel/traverse'
import {
  Node,
  identifier,
  assignmentExpression,
  variableDeclarator,
  variableDeclaration,
  expressionStatement,
  Identifier,
} from '@babel/types'

Error.stackTraceLimit = 1000

export default function (): { visitor: Visitor } {
  return {
    visitor: {
      FunctionExpression(path) {
        if (path.parent.type !== 'CallExpression' || !path.parentPath.parent || path.parent.callee.type !== 'FunctionExpression') {
          return
        }

        switch (path.parentPath.parent.type) {
          case 'ArrayExpression': {
            const statementParent = path.findParent(p => p.isStatement())
            if (!statementParent) {
              throw new Error(`Found no statement parent for array expression`)
            }

            const elmId = path.parentPath.parentPath.scope.generateUidIdentifier('_arrayElm')
            statementParent.insertBefore(variableDeclaration('const', [
              variableDeclarator(elmId, path.parent)
            ]))
            path.parentPath.replaceWith(elmId)
          } return

          case 'SequenceExpression': {
            const statementParent = path.findParent(p => p.isStatement())
            if (!statementParent) {
              throw new Error(`Found no statement parent for sequence expression`)
            }

            for (const exp of path.parentPath.parent.expressions) {
              statementParent.insertBefore(expressionStatement(exp))
            }
            path.parentPath.parentPath.remove()
          } return

          default: break
        }

        const blockStatement = path.get('body')
        const firstStatement = (path.get('body.body') as NodePath<Node>[])[0]

        for (let i = 0 ; i < path.parent.arguments.length; ++i) {
          const arg = path.parent.arguments[i]
          const param = path.node.params[i]

          if (param.type !== 'Identifier') {
            throw new Error(`Unknown IIFE param type: ${param.type}`)
          }

          if (arg && param) {
            firstStatement.insertBefore(variableDeclaration('const', [
              variableDeclarator(
                param,
                arg as any
              )
            ]))
          }
        }

        path.parent.arguments = []
        path.node.params = []

        let returnId: Identifier | null = null

        path.traverse({
          FunctionDeclaration(childPath) {
            childPath.skip()
          },

          FunctionExpression(childPath) {
            childPath.skip()
          },

          ReturnStatement(childPath) {
            if (!returnId) {
              returnId = path.scope.generateDeclaredUidIdentifier('_return')
            }

            childPath.replaceWith(assignmentExpression(
              '=',
              returnId,
              childPath.node.argument || identifier('undefined')
            ))
          },
        })

        if (returnId) {
          const statementParent = path.findParent(p => p.isStatement())
          if (!statementParent) {
            throw new Error(`Failed to find a statement parent for variable declarator`)
          }
          statementParent.insertBefore(expressionStatement(path.parent))

          if (path.parentPath.parent.type === 'VariableDeclarator') {
            path.parentPath.parent.init = returnId
          } else {
            path.parentPath.replaceWith(returnId)
          }

          return
        }

        const block = path.get('body.body') as NodePath<Node>[]

        // Transpilate scope-related things
        for (const childPath of block) {
          switch (childPath.node.type) {
            case 'VariableDeclaration': {
              for (const decl of childPath.node.declarations) {
                switch (decl.id.type) {
                  case 'Identifier': {
                    if (path.parentPath.scope.hasBinding(decl.id.name)) {
                      const newId = path.scope.generateUidIdentifier(decl.id.name)
                      blockStatement.scope.rename(decl.id.name, newId.name)
                    }
                  } break

                  default: {
                    throw new Error(`Unknown LVal type used in variable declaration: ${decl.id.type}`)
                  }
                }
              }
            } break
          }
        }

        // replace iife
        path.parentPath.parentPath.replaceWithMultiple(blockStatement.node.body)
      }
    },
  }
}
