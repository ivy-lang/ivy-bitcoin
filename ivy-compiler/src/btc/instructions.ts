import { createTypeSignature, TypeSignature } from "./types"

import { BugError } from "../errors"

export type UnaryOperator = "!" | "negate" // to avoid ambiguity

export function isDeclarableUnaryOperator(str: string): str is "!" | "-" {
  // this is really for the parser
  return str === "!" || str === "-"
}

export type ComparisonOperator = "==" | "!=" | ">" | "<" | ">=" | "<="

export function isComparisonOperator(str: string): str is ComparisonOperator {
  return ["==", "!=", ">", "<", ">=", "<="].indexOf(str) !== -1
}

export type ArithmeticOperator = "+" | "-"

export function isArithmeticOperator(str: string): str is ArithmeticOperator {
  return str === "+" || str === "-"
}

export type FunctionName =
  | "checkSig"
  | "ripemd160"
  | "sha1"
  | "sha256"
  | "min"
  | "max"
  | "within"
  | "abs"
  | "size"
  | "older"
  | "after"
  | "checkMultiSig"

export type Opcode = string // for now

export type BinaryOperator = ComparisonOperator | ArithmeticOperator

export type Instruction = UnaryOperator | BinaryOperator | FunctionName

// slightly hackish runtime type guard

export function isInstruction(
  instructionName: Instruction | string
): instructionName is Instruction {
  const opcodes = getOpcodes(instructionName as Instruction)
  return opcodes !== undefined
}

export function getOpcodes(instruction: Instruction): Opcode[] {
  switch (instruction) {
    case "checkSig":
      return ["CHECKSIG"]
    case "ripemd160":
      return ["RIPEMD160"]
    case "sha1":
      return ["SHA1"]
    case "sha256":
      return ["SHA256"]
    case "min":
      return ["MIN"]
    case "max":
      return ["MAX"]
    case "within":
      return ["WITHIN"]
    case "abs":
      return ["ABS"]
    case "size":
      return ["SIZE", "SWAP", "DROP"]
    case "older":
      return ["CHECKSEQUENCEVERIFY", "DROP", "1"] // will get special treatment
    case "after":
      return ["CHECKLOCKTIMEVERIFY", "DROP", "1"] // will get special treatment
    case "checkMultiSig":
      return ["CHECKMULTISIG"] // will get special treatment
    case "negate":
      return ["NEGATE"]
    case "!":
      return ["NOT"]
    case "+":
      return ["ADD"]
    case "-":
      return ["SUB"]
    case "==":
      return ["EQUAL"]
    case "!=":
      return ["EQUAL", "NOT"]
    case "<":
      return ["LESSTHAN"]
    case ">":
      return ["GREATERTHAN"]
    case ">=":
      return ["GREATERTHANOREQUAL"]
    case "<=":
      return ["LESSTHANOREQUAL"]
  }
}

export function getTypeSignature(instruction: Instruction): TypeSignature {
  switch (instruction) {
    case "+":
    case "-":
    case "min":
    case "max":
      return createTypeSignature(["Integer", "Integer"], "Integer")
    case "<":
    case ">":
    case ">=":
    case "<=":
      return createTypeSignature(["Integer", "Integer"], "Boolean")
    case "!":
      return createTypeSignature(["Boolean"], "Boolean")
    case "negate":
    case "abs":
      return createTypeSignature(["Integer"], "Integer")
    case "checkSig":
      return createTypeSignature(["PublicKey", "Signature"], "Boolean")
    case "size":
      return createTypeSignature(["Bytes"], "Integer")
    case "within":
      return createTypeSignature(["Integer", "Integer", "Integer"], "Boolean")
    case "older":
      return createTypeSignature(["Duration"], "Verifiable")
    case "after":
      return createTypeSignature(["Time"], "Verifiable") // special-cased
    case "checkMultiSig":
      return createTypeSignature(
        [
          { type: "listType", elementType: "PublicKey" },
          { type: "listType", elementType: "Signature" }
        ],
        "Boolean"
      )
    case "==":
    case "!=":
      throw new Error("should not call getTypeSignature on == or !=")
    case "ripemd160":
    case "sha1":
    case "sha256":
      throw new Error("should not call getTypeSignature on hash function")
  }
}
