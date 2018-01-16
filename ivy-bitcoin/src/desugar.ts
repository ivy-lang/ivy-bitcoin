import {
  ASTNode,
  Block,
  Clause,
  Conditional,
  Contract,
  Expression,
  InstructionExpression,
  ListLiteral,
  mapOverAST,
  RawContract,
  Statement
} from "./ast"

import { BugError } from "./errors"

function setupClauses(oldClauses: Clause[], clauseSelector: string): Block {
  const newClauses = [...oldClauses]
  const clause = newClauses.pop()
  if (clause === undefined) {
    throw new BugError("undefined clause")
  }
  if (newClauses.length === 0) {
    // last clause, or only one clause
    return clause
  }
  const args: Expression[] = [
    {
      type: "literal",
      literalType: "Integer",
      location: clause.location,
      value: newClauses.length.toString()
    },
    {
      type: "variable",
      location: clause.location,
      name: clauseSelector
    }
  ]
  const condition: InstructionExpression = {
    type: "instructionExpression",
    expressionType: "binaryExpression",
    location: clause.location,
    instruction: "==",
    args
  }
  return {
    type: "conditional",
    location: clause.location,
    condition,
    ifBlock: clause,
    elseBlock: setupClauses(newClauses, clauseSelector)
  }
}

export function desugarClauses(rawContract: RawContract): Contract {
  const clauses = rawContract.clauses
  const numClauses = clauses.length
  const clauseSelector = clauses.map(clause => clause.name).join("/")

  const block = setupClauses(clauses, clauseSelector)

  if (rawContract.referenceCounts === undefined) {
    throw new BugError("raw contract reference counts unexpectedly undefined")
  }

  return {
    type: "contract",
    location: rawContract.location,
    name: rawContract.name,
    parameters: rawContract.parameters,
    block,
    numClauses,
    clauseSelector: clauseSelector === "/" ? undefined : clauseSelector,
    referenceCounts: rawContract.referenceCounts
  }
}

function isSpecialInstruction(statement: Statement) {
  // returns true if statement is a checklocktimeverify or checksequenceverify statement
  return (
    statement.type === "assertion" &&
    statement.expression.type === "instructionExpression" &&
    (statement.expression.instruction === "older" ||
      statement.expression.instruction === "after")
  )
}

export function rearrangeStatements(contract: RawContract): RawContract {
  // this implements an optimization where checklocktimeverify and check
  return mapOverAST((node: ASTNode) => {
    switch (node.type) {
      case "clause": {
        if (node.statements.some(isSpecialInstruction)) {
          node.statements.sort((a, b) => {
            if (a.type === "unlock") {
              return 1
            }
            if (b.type === "unlock") {
              return -1
            }
            const aIsSpecial = isSpecialInstruction(a)
            const bIsSpecial = isSpecialInstruction(b)
            if (aIsSpecial && !bIsSpecial) {
              return -1
            }
            if (!aIsSpecial && bIsSpecial) {
              return 1
            }
            return 0
          })
        }
        return node
      }
      default:
        return node
    }
  }, contract) as RawContract
}

export function desugarContract(rawContract: RawContract): Contract {
  const rearranged = rearrangeStatements(rawContract)
  const contract = desugarClauses(rearranged)

  return mapOverAST((node: ASTNode) => {
    switch (node.type) {
      case "instructionExpression": {
        if (node.instruction === "checkMultiSig") {
          // deconstruct the lists
          // and add the dummy 0 value
          const pubKeys = node.args[0] as ListLiteral
          const sigs = node.args[1] as ListLiteral
          const args: Expression[] = [
            {
              type: "literal",
              location: pubKeys.location,
              literalType: "Integer",
              value: pubKeys.values.length.toString()
            },
            ...pubKeys.values,
            {
              type: "literal",
              location: sigs.location,
              literalType: "Integer",
              value: sigs.values.length.toString()
            },
            ...sigs.values,
            {
              type: "literal",
              location: node.location,
              literalType: "Integer",
              value: "0"
            }
          ] // dummy 0 value
          return {
            ...node,
            args
          }
        } else {
          return node
        }
      }
      default:
        return node
    }
  }, contract) as Contract
}
