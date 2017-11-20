import { ASTNode, mapOverAST, RawContract } from "./ast"

import { Type } from "./btc/types"

import { NameError } from "./errors"

export function referenceCheck(contract: RawContract): RawContract {
  // annotate parameters and variables with their scope and reference count within that clause
  // there are two mappings over ASTs—one that finds the clauses, and one that maps over those clauses
  // also throw an error on undefined or unused variables

  const types = new Map<string, Type>()

  const contractCounts = new Map<string, number>()

  for (const parameter of contract.parameters) {
    if (contractCounts.has(parameter.name)) {
      throw new NameError("parameter " + parameter.name + " is already defined")
    }
    contractCounts.set(parameter.name, 0)
    types.set(parameter.name, parameter.itemType)
  }

  const result = mapOverAST((node: ASTNode) => {
    switch (node.type) {
      case "clause": {
        const clauseName = node.name

        const clauseParameters = node.parameters.map(param => {
          return {
            ...param,
            scope: clauseName
          }
        })

        const counts = new Map<string, number>()

        for (const parameter of contract.parameters) {
          counts.set(parameter.name, 0)
        }

        for (const parameter of clauseParameters) {
          if (contractCounts.has(parameter.name)) {
            throw new NameError(
              "parameter " + parameter.name + " is already defined"
            )
          }
          counts.set(parameter.name, 0)
          types.set(clauseName + "." + parameter.name, parameter.itemType)
        }

        const mappedClause = mapOverAST((astNode: ASTNode) => {
          switch (astNode.type) {
            case "variable": {
              const currentContractCount = contractCounts.get(astNode.name)
              const currentCount = counts.get(astNode.name)
              if (currentCount === undefined) {
                throw new NameError("unknown variable: " + astNode.name)
              }
              counts.set(astNode.name, currentCount + 1)
              if (currentContractCount !== undefined) {
                contractCounts.set(astNode.name, currentContractCount + 1)
                return {
                  ...astNode,
                  itemType: types.get(astNode.name)
                }
              } else {
                return {
                  ...astNode,
                  scope: clauseName,
                  itemType: types.get(clauseName + "." + astNode.name)
                }
              }
            }
            default:
              return astNode
          }
        }, node)
        for (const parameter of clauseParameters) {
          if (counts.get(parameter.name) === 0) {
            throw new NameError(
              "unused variable in clause " + clauseName + ": " + parameter.name
            )
          }
        }
        for (const parameter of contract.parameters) {
          if (parameter.itemType === "Value") {
            const count = counts.get(parameter.name)
            if (count === undefined) {
              throw new Error("count unexpectedly undefined")
            }
            if (count === 0) {
              throw new NameError(
                "Value " +
                  parameter.name +
                  " must be disposed of in clause " +
                  clauseName
              )
            } else if (count > 1) {
              throw new NameError(
                "Value " +
                  parameter.name +
                  " cannot be used twice in clause " +
                  clauseName
              )
            }
          }
        }
        return {
          ...mappedClause,
          referenceCounts: counts,
          parameters: clauseParameters
        }
      }
      default:
        return node
    }
  }, contract)
  for (const parameter of contract.parameters) {
    if (contractCounts.get(parameter.name) === 0) {
      throw new NameError("unused parameter: " + parameter.name)
    }
  }
  return {
    ...result,
    referenceCounts: contractCounts
  } as RawContract
}
