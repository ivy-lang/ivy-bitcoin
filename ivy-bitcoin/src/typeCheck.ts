import {
  createTypeSignature,
  getTypeClass,
  Hash,
  inputTypesToString,
  isHash,
  isHashFunctionName,
  isList,
  isPrimitive,
  isTypeClass,
  List,
  Primitive,
  Type,
  TypeClass,
  TypeSignature,
  typeToString
} from "./btc/types"

import {
  ASTNode,
  Clause,
  Expression,
  Import,
  ListLiteral,
  mapOverAST,
  Parameter,
  RawContract,
  scopedName,
  Statement,
  ValueLiteral,
  Variable
} from "./ast"

import { getTypeSignature } from "./btc/instructions"

import { BugError, IvyTypeError, NameError } from "./errors"

import { Template } from "./template"

export type TypeMap = Map<string, Type>

export interface ImportMap {
  [s: string]: Template
}

function isSameType(type1: Type, type2: Type) {
  const typeClass = getTypeClass(type1)
  if (typeClass !== getTypeClass(type2)) {
    return false
  }
  switch (typeClass) {
    case "Primitive":
      return type1 === type2
    case "Hash":
      return (
        (type1 as Hash).hashFunction === (type2 as Hash).hashFunction &&
        isSameType((type1 as Hash).inputType, (type2 as Hash).inputType)
      )
    case "List":
      return isSameType(
        (type1 as List).elementType,
        (type2 as List).elementType
      )
  }
}

function unify(left: Type, right: Type, mapping: TypeMap) {
  if (isSameType(left, right)) {
    return true // identical; trivially satisfied; move on
  }
  if (left === "Address") {
    throw new IvyTypeError(
      "cannot use item of type Program outside of a lock statement"
    )
  }
  const typeClass = getTypeClass(left)
  if (typeClass !== getTypeClass(right)) {
    throw new IvyTypeError(
      "incompatible types: " +
        typeToString(left) +
        " and " +
        typeToString(right)
    )
  }
  switch (typeClass) {
    case "Primitive": {
      throw new IvyTypeError("incompatible types: " + left + " and " + right) // we know they're not the same type
    }
    case "List":
      return unify(
        (left as List).elementType,
        (right as List).elementType,
        mapping
      )
    case "Hash": {
      const leftHashFunction = (left as Hash).hashFunction
      const rightHashFunction = (right as Hash).hashFunction
      if (leftHashFunction !== rightHashFunction) {
        throw new IvyTypeError(
          "incompatible hash functions: " +
            leftHashFunction +
            " and " +
            rightHashFunction
        )
      }
      return unify((left as Hash).inputType, (right as Hash).inputType, mapping)
    }
  }
}

export function matchTypes(firstType: Type, secondType: Type) {
  const typeClass = getTypeClass(firstType)
  if (typeClass !== getTypeClass(secondType)) {
    throw new IvyTypeError(
      "got " +
        typeToString(secondType) +
        ", expected " +
        typeToString(firstType)
    )
  }
  switch (typeClass) {
    case "Primitive":
      if (firstType !== secondType) {
        throw new IvyTypeError(
          "got " +
            typeToString(secondType) +
            ", expected " +
            typeToString(firstType)
        )
      }
      return
    case "Hash":
      if (!isHash(firstType) || !isHash(secondType)) {
        throw new BugError("type guard surprisingly failed")
      }
      if (firstType.hashFunction !== secondType.hashFunction) {
        throw new IvyTypeError(
          "cannot match " +
            typeToString(firstType) +
            " with " +
            typeToString(secondType)
        )
      }
      matchTypes(firstType.inputType, secondType.inputType)
      return
    case "List":
      matchTypes(
        (firstType as List).elementType,
        (secondType as List).elementType
      )
      return
    default:
      throw new BugError("type class should have been handled")
  }
}

export function unifyFunction(
  typeSignature: TypeSignature,
  inputTypes: Type[]
): Type {
  // typecheck some inputs against the function's type signature
  // also maybe compute the output type and/or more specific input types

  const typeSigInputs = typeSignature.inputs
  if (inputTypes.length !== typeSignature.inputs.length) {
    throw new IvyTypeError(
      "got " +
        inputTypesToString(inputTypes) +
        ", expected " +
        inputTypesToString(typeSigInputs)
    )
  }
  for (let i = 0; i < inputTypes.length; i++) {
    const firstType = typeSigInputs[i]
    const secondType = inputTypes[i]
    matchTypes(firstType, secondType)
  }
  return typeSignature.output
}

export function typeCheckExpression(expression: Expression): Type {
  switch (expression.type) {
    case "instructionExpression":
      const inputTypes = expression.args.map(arg => typeCheckExpression(arg))
      if (isHashFunctionName(expression.instruction)) {
        const inputType = typeCheckExpression(expression.args[0])
        if (inputTypes.length !== 1) {
          throw new IvyTypeError("hash function expected 1 argument, got " + inputTypes.length)
        }
        if (
          !isHash(inputType) &&
          inputType !== "Bytes" &&
          inputType !== "PublicKey"
        ) {
          throw new IvyTypeError(
            "cannot hash item of type " + typeToString(inputType)
          )
        }
        return {
          type: "hashType",
          hashFunction: expression.instruction,
          inputType
        }
      }
      switch (expression.instruction) {
        case "bytes":
          if (inputTypes.length !== 1) { 
            throw new IvyTypeError("bytes function expected 1 argument, got " + inputTypes.length)
          }
          if (inputTypes[0] === "Value") {
            throw new IvyTypeError("cannot call bytes on an item of type Value")
          }
          if (inputTypes[0] === "Boolean") {
            throw new IvyTypeError("cannot call bytes on an item of type Boolean")
          }
          return "Bytes"
        case "==":
        case "!=":
          if (inputTypes[0] === "Boolean" || inputTypes[1] === "Boolean") {
            throw new IvyTypeError(
              "cannot pass value of type Boolean to " + expression.instruction
            )
          }
          matchTypes(inputTypes[0], inputTypes[1])
          return "Boolean"
        default:
          const typeSig = getTypeSignature(expression.instruction)
          unifyFunction(typeSig, inputTypes)
          return typeSig.output
      }
    case "literal": {
      return expression.literalType
    }
    case "variable":
      if (expression.itemType === undefined) {
        throw new Error("no type for variable " + expression.name)
      }
      return expression.itemType
    case "listLiteral":
      if (expression.values.length === 0) {
        throw new IvyTypeError("lists cannot be empty")
      }
      const unifiedType = expression.values
        .map(exp => typeCheckExpression(exp))
        .reduce((firstType, secondType) => {
          matchTypes(firstType, secondType)
          return firstType
        })
      return { type: "listType", elementType: unifiedType }
  }
}

export function typeCheckStatement(statement: Statement) {
  switch (statement.type) {
    case "assertion": {
      const expressionType = typeCheckExpression(statement.expression)
      if (expressionType !== "Boolean") {
        throw new IvyTypeError(
          "verify statement expects a Boolean, got " +
            typeToString(expressionType)
        )
      }
      return
    }
    case "unlock": {
      const expressionType = typeCheckExpression(statement.value)
      if (expressionType !== "Value") {
        throw new IvyTypeError(
          "unlock statement expects a Value, got " +
            typeToString(expressionType)
        )
      }
      return
    }
  }
}

export function typeCheckClause(clause: Clause) {
  for (const statement of clause.statements) {
    typeCheckStatement(statement)
  }
}

function checkUniqueClauseNames(clauses: Clause[]) {
  const clauseNames = clauses.map(clause => clause.name)
  if (new Set(clauseNames).size !== clauseNames.length) {
    throw new NameError("clause names must be unique")
  }
}

function checkMultiSigArgumentCounts(contract: RawContract) {
  mapOverAST((node: ASTNode) => {
    switch (node.type) {
      case "instructionExpression": {
        // check checkMultiSig argument counts
        if (node.instruction === "checkMultiSig") {
          const pubKeys = node.args[0] as ListLiteral
          const sigs = node.args[1] as ValueLiteral
          if (parseInt(sigs.value, 10) > pubKeys.values.length) {
            throw new IvyTypeError(
              "number of public keys passed to checkMultiSig " +
                "must be greater than or equal to number of signatures"
            )
          }
        }
        return node
      }
      default:
        return node
    }
  }, contract)
}

function isSignatureCheck(statement: Statement) {
  return (
    statement.type === "unlock" ||
    (statement.type === "assertion" &&
      statement.expression.type === "instructionExpression" &&
      statement.expression.instruction === "checkSig") // don't even allow multisig yet
  )
}

function checkValueFlow(rawContract: RawContract): RawContract {
  // find if there's a clause that just checks some signatures
  let sigCheckClause: undefined | Clause
  mapOverAST((node: ASTNode) => {
    switch (node.type) {
      case "clause": {
        if (
          node.parameters.every(param => param.itemType === "Signature") &&
          node.statements.every(isSignatureCheck) // conservative for now
        ) {
          sigCheckClause = node
        }
        return node
      }
      default:
        return node
    }
  }, rawContract)

  // annotate clauses that include outputs with preapprovals
  // and remove unlock statements while we're at it
  return mapOverAST((node: ASTNode) => {
    switch (node.type) {
      case "clause": {
        return {
          ...node,
          statements: node.statements.filter(
            statement => statement.type === "assertion"
          )
        }
      }
      default:
        return node
    }
  }, rawContract) as RawContract
}

export function typeCheckContract(rawContract: RawContract): RawContract {
  checkUniqueClauseNames(rawContract.clauses)

  const numValues = rawContract.parameters.filter(
    param => param.itemType === "Value"
  ).length
  if (numValues === 0) {
    throw new IvyTypeError("A contract must have a parameter of type Value.")
  }
  if (numValues > 1) {
    throw new IvyTypeError(
      "A contract can only have one parameter of type Value."
    )
  }
  for (const parameter of rawContract.parameters) {
    if (parameter.itemType === undefined) {
      throw new BugError("parameter type unexpectedly undefined")
    }
    if (parameter.itemType === "Signature") {
      throw new IvyTypeError("Signatures cannot be used as contract parameters")
    }
  }
  for (const clause of rawContract.clauses) {
    for (const parameter of clause.parameters) {
      if (parameter.itemType === "Value") {
        throw new IvyTypeError("Values cannot be used as clause parameters")
      }
    }
  }

  for (const clause of rawContract.clauses) {
    typeCheckClause(clause)
  }

  checkMultiSigArgumentCounts(rawContract)

  return checkValueFlow(rawContract)
}
