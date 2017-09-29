// compile to an intermediate representation

import {
  ASTNode,
  Block,
  Clause,
  Contract,
  Expression,
  InstructionExpression,
  mapOverAST,
  Parameter,
  Variable
} from "./ast"

import { BugError } from "./errors"

import { Instruction } from "./btc/instructions"

export type Operation =
  | Get
  | Pick
  | Roll
  | BeginContract
  | InstructionOp
  | Verify
  | Push
  | BeginIf
  | Else
  | EndIf
  | BeginClause
  | EndClause
  | PushParameter
  | Drop

export type FinalOperation =
  | Pick
  | Roll
  | InstructionOp
  | Verify
  | Push
  | BeginIf
  | Else
  | EndIf
  | PushParameter
  | Drop

export interface Get {
  type: "get"
  variable: Variable
}

export interface Pick {
  type: "pick"
  depth: number
}

export interface Roll {
  type: "roll"
  depth: number
}

export interface Drop {
  type: "drop"
}

export interface BeginContract {
  type: "beginContract"
  contract: Contract
}

export interface InstructionOp {
  type: "instructionOp"
  expression: InstructionExpression
}

export interface Verify {
  type: "verify"
}

export interface Push {
  type: "push"
  literalType: "Integer" | "Boolean" | "Bytes"
  value: string
}

export interface PushParameter {
  type: "pushParameter"
  name: string
}

export interface BeginIf {
  type: "beginIf"
}

export interface EndIf {
  type: "endIf"
}

export interface Else {
  type: "else"
}

export interface BeginClause {
  type: "beginClause"
  clause: Clause
}

export interface EndClause {
  type: "endClause"
  clause: Clause
}

export function operationToString(op: Operation): string {
  switch (op.type) {
    case "verify":
    case "beginIf":
    case "else":
    case "endIf":
      return op.type
    case "beginClause":
      return "(beginClause " + op.clause.name + ")"
    case "endClause":
      return "(endClause " + op.clause.name + ")"
    case "push":
      return op.literalType === "Bytes"
        ? "(push 0x" + op.value + ")"
        : "(push " + op.value + ")"
    case "instructionOp":
      return op.expression.instruction
    case "beginContract":
      return (
        "(beginContract (" +
        op.contract.parameters.map(param => param.name).join(", ") +
        "))"
      )
    case "get":
      return "(get " + op.variable.name + ")"
    case "pick":
      return "(pick " + op.depth + ")"
    case "roll":
      return "(roll " + op.depth + ")"
    case "pushParameter":
      return "(push " + op.name + ")"
    case "drop":
      return "drop"
  }
}

export function operationsToString(ops: Operation[]): string {
  return ops.map(operationToString).join(" ")
}

export function compileContractToIntermediate(contract: Contract): Operation[] {
  const operations: Operation[] = []

  const emit = (op: Operation) => operations.push(op)

  compileToIntermediate(contract, emit)

  return operations
}

function compileToIntermediate(
  node: ASTNode,
  emit: (op: Operation) => void
): ASTNode {
  const compile = n => compileToIntermediate(n, emit)

  switch (node.type) {
    case "contract": {
      emit({ type: "beginContract", contract: node })
      compile(node.block)
      return node
    }
    case "rawcontract": {
      throw new BugError(
        "raw contract passed to compileToIntermediate, which expects a desugared contract"
      )
    }
    case "clause": {
      emit({ type: "beginClause", clause: node })
      const statements = [...node.statements]
      statements.slice(0, -1).map(compile)
      // just the expression from the last statement in each clause
      // don't verify it (because of the implicit verify at the end of Bitcoin Script)
      const last = statements[statements.length - 1]
      if (!last) {
        emit({ type: "push", literalType: "Boolean", value: "true" })
      } else if (last.type !== "assertion") {
        throw new BugError("expected last statement to be assertion")
      } else {
        compile(last.expression)
      }
      emit({ type: "endClause", clause: node })
      return node
    }
    case "conditional": {
      compile(node.condition)
      emit({ type: "beginIf" })
      compile(node.ifBlock)
      if (node.elseBlock) {
        emit({ type: "else" })
        compile(node.elseBlock)
      }
      emit({ type: "endIf" })
      return node
    }
    case "assertion": {
      compile(node.expression)
      emit({ type: "verify" })
      return node
    }
    case "instructionExpression": {
      node.args
        .slice()
        .reverse()
        .map(compile)
      emit({ type: "instructionOp", expression: node })
      return node
    }
    case "variable": {
      emit({ type: "get", variable: node })
      return node
    }
    case "literal": {
      emit({ type: "push", literalType: node.literalType, value: node.value })
      return node
    }
    case "unlock": {
      return node
    }
    case "listLiteral": {
      throw new BugError(
        "list literal should have been desugared before compileToIntermediate"
      )
    }
    case "parameter": {
      throw new BugError(
        "parameter should not be passed to compileToIntermediate"
      )
    }
  }
}
