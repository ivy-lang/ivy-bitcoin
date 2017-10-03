import { Instruction, isInstruction } from "./btc/instructions"
import { Hash, Primitive, Type, typeToString } from "./btc/types"
import { BugError, NameError } from "./errors"

export interface Location {
  start: { column: number; line: number }
  end: { column: number; line: number }
}

export type InstructionExpressionType =
  | "unaryExpression"
  | "binaryExpression"
  | "callExpression"

export interface Parameter {
  type: "parameter"
  location: Location
  name: string
  itemType: Primitive | Hash
  scope?: string
}

export interface Import {
  type: "import"
  name: string
}

export interface RawContract {
  type: "rawcontract"
  location: Location
  name: string
  parameters: Parameter[]
  clauses: Clause[]
  referenceCounts?: Map<string, number>
}

export interface Conditional {
  type: "conditional"
  condition: Expression
  ifBlock: Block
  elseBlock?: Block
}

export type Block = Conditional | Clause

export interface Contract {
  type: "contract"
  location: Location
  name: string
  parameters: Parameter[]
  block: Block
  numClauses: number
  clauseSelector?: string
}

export interface Clause {
  type: "clause"
  location: Location
  name: string
  parameters: Parameter[]
  statements: Statement[]
  referenceCounts?: Map<string, number>
}

export interface Assertion {
  type: "assertion"
  location: Location
  expression: Expression
}

export interface Unlock {
  type: "unlock"
  location: Location
  value: Variable
}

export type Statement = Assertion | Unlock

export function statementToString(statement: Statement) {
  switch (statement.type) {
    case "assertion":
      return "verify " + expressionToString(statement.expression)
    case "unlock":
      return "unlock " + statement.value
  }
}

export type Expression =
  | InstructionExpression
  | ListLiteral
  | ValueLiteral
  | Variable

export interface InstructionExpression {
  type: "instructionExpression"
  expressionType: InstructionExpressionType
  instruction: Instruction
  location: Location
  args: Expression[]
}

export interface PartialExpression {
  // this is only for createBinaryExpression
  type: "partial"
  operator: string
  left: Expression
}

export function createBinaryExpression(
  partials: PartialExpression[],
  right: Expression
): Expression {
  const last = partials.pop()
  if (last === undefined) {
    throw new BugError("partials list must not be empty")
  }
  const operator = last.operator
  const left = partials.length
    ? createBinaryExpression(partials, last.left)
    : last.left
  return createInstructionExpression(
    "binaryExpression",
    left.location,
    operator,
    [right, left]
  )
}

export function createInstructionExpression(
  expressionType: InstructionExpressionType,
  location: Location,
  name: string,
  args: Expression[]
): Expression {
  const instruction =
    expressionType === "unaryExpression" && name === "-" ? "negate" : name
  if (!isInstruction(instruction)) {
    throw new NameError("invalid instruction name: " + instruction)
  }

  return {
    type: "instructionExpression",
    expressionType,
    instruction,
    location,
    args
  }
}

export interface Variable {
  type: "variable"
  location: Location
  name: string
  scope?: string
  itemType?: Type
}

export type LiteralType = "Integer" | "Boolean"

export interface ListLiteral {
  type: "listLiteral"
  location: Location
  values: Expression[]
}

export interface ValueLiteral {
  type: "literal"
  literalType: LiteralType
  location: Location
  value: string
}

export function contractToString(contract: RawContract) {
  return (
    "contract " +
    contract.name +
    "(" +
    contract.parameters.map(param => parameterToString(param)).join(", ") +
    ") {\n  " +
    contract.clauses.map(clause => clauseToString(clause)).join("\n  ") +
    "\n}"
  )
}

function clauseToString(clause: Clause) {
  return (
    "clause " +
    clause.name +
    "(" +
    clause.parameters.map(param => parameterToString(param)).join(", ") +
    ") {\n    " +
    clause.statements
      .map(statement => statementToString(statement))
      .join("\n    ") +
    "\n  }"
  )
}

function literalToString(literal: ValueLiteral) {
  switch (literal.literalType) {
    case "Integer":
    case "Boolean":
      return literal.value
  }
}

function instructionExpressionToString(expression: InstructionExpression) {
  switch (expression.expressionType) {
    case "unaryExpression":
      if (expression.instruction === "negate") {
        return "-" + expressionToString(expression.args[0])
      } else {
        return expression.instruction + expressionToString(expression.args[0])
      }
    case "binaryExpression":
      return (
        "(" +
        expressionToString(expression.args[0]) +
        " " +
        expression.instruction +
        " " +
        expressionToString(expression.args[1]) +
        ")"
      )
    case "callExpression":
      return (
        expression.instruction +
        "(" +
        expression.args.map(exp => expressionToString(exp)).join(", ") +
        ")"
      )
  }
}

function listLiteralToString(expression: ListLiteral) {
  return (
    "[" + expression.values.map(exp => expressionToString(exp)).join(", ") + "]"
  )
}

function expressionToString(expression: Expression): string {
  switch (expression.type) {
    case "literal":
      return literalToString(expression)
    case "instructionExpression":
      return instructionExpressionToString(expression)
    case "variable":
      return scopedName(expression)
    case "listLiteral":
      return listLiteralToString(expression)
  }
}

function parameterToString(parameter: Parameter) {
  return (
    parameter.name +
    (parameter.itemType === undefined
      ? ""
      : ": " + typeToString(parameter.itemType))
  )
}

export type ASTNode =
  | Parameter
  | RawContract
  | Contract
  | Conditional
  | Clause
  | Statement
  | Expression

export function mapOverAST(func: (Node) => ASTNode, node: ASTNode): ASTNode {
  switch (node.type) {
    case "parameter": {
      return func(node)
    }
    case "rawcontract": {
      return func({
        ...node,
        parameters: node.parameters.map(param => mapOverAST(func, param)),
        clauses: node.clauses.map(clause => mapOverAST(func, clause))
      })
    }
    case "contract": {
      return func({
        ...node,
        parameters: node.parameters.map(param => mapOverAST(func, param)),
        block: mapOverAST(func, node.block)
      })
    }
    case "conditional": {
      return func({
        ...node,
        condition: mapOverAST(func, node.condition),
        ifBlock: mapOverAST(func, node.ifBlock),
        elseBlock: node.elseBlock ? mapOverAST(func, node.elseBlock) : undefined
      })
    }
    case "clause": {
      return func({
        ...node,
        parameters: node.parameters.map(param => mapOverAST(func, param)),
        statements: node.statements.map(st => mapOverAST(func, st))
      })
    }
    case "assertion": {
      return func({
        ...node,
        expression: mapOverAST(func, node.expression)
      })
    }
    case "instructionExpression": {
      return func({
        ...node,
        args: node.args.map(arg => mapOverAST(func, arg))
      })
    }
    case "variable": {
      return func(node)
    }
    case "listLiteral": {
      return func({
        ...node,
        values: node.values.map(val => mapOverAST(func, val))
      })
    }
    case "literal": {
      return func(node)
    }
    case "unlock": {
      return func({
        ...node,
        value: func(node.value)
      })
    }
  }
}

export function scopedName(item: Parameter | Variable | Import): string {
  if (item.type === "import") {
    return item.name
  }
  return item.scope === undefined ? item.name : item.scope + "." + item.name
}
