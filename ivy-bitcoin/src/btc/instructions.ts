import { createTypeSignature, TypeSignature } from "./types"

import { create } from "domain"
import { BugError } from "../errors"

export type OrOperator = "||"

export type AndOperator = "&&"

export type BitwiseOperator =
  | "^"
  | "&"
  | "|"

export type ArithmeticOperator =
  |"+"
  | "-"

export type MultiplicativeOperator =
  | "*"
  | "/"
  | "%"

export type UnaryOperator =
  | "-"
  | "!"

export type ComparisonOperator =
  | "=="
  | "!="
  | "<"
  | ">"
  | "<="
  | ">="


export function isComparisonOperator(str: string): str is ComparisonOperator {
  return ["==", "!="].indexOf(str) !== -1
}

export type FunctionName =
  | "checkSig"
  | "ripemd160"
  | "sha1"
  | "sha256"
  | "older"
  | "after"
  | "checkMultiSig"
  | "min"
  | "max"
  | "within"
  | "abs"
  | "substr"
  | "cat"
  | "bytes"
  | "size"

export type Opcode = string // for now

export type BinaryOperator =
  | ComparisonOperator
  | MultiplicativeOperator
  | ArithmeticOperator
  | BitwiseOperator
  | AndOperator
  | OrOperator

export type Instruction =
  | BinaryOperator
  | FunctionName
  | UnaryOperator

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
    case "older":
      return ["CHECKSEQUENCEVERIFY", "DROP", "1"] // will get special treatment
    case "after":
      return ["CHECKLOCKTIMEVERIFY", "DROP", "1"] // will get special treatment
    case "checkMultiSig":
      return ["CHECKMULTISIG"] // will get special treatment
    case "min":
      return ["MIN"]
    case "max":
      return ["MAX"]
    case "within":
      return ["WITHIN"]
    case "abs":
      return ["ABS"]
    case "cat":
      return ["CAT"]
    case "==":
      return ["EQUAL"]
    case "!=":
      return ["EQUAL", "NOT"]
    case "<":
      return ["LESSTHAN"]
    case ">":
      return ["GREATERTHAN"]
    case "<=":
      return ["LESSTHANOREQUAL"]
    case ">=":
      return ["GREATERTHANOREQUAL"]
    case "||":
      return ["OR"]
    case "&&":
      return ["AND"]
    case "^":
      return ["XOR"]
    case "&":
      return ["AND"]
    case "|":
      return ["OR"]
    case "+":
      return ["ADD"]
    case "-":
      return ["SUB", "NEGATE"]
    case "*":
      return ["MUL"]
    case "/":
      return ["DIV"]
    case "%":
      return ["MOD"]
    case "!":
      return ["NOT"]
    case "substr":
      return ["SPLIT"]
    case "bytes":
      return []
    case "size":
      return ["SIZE", "SWAP", "DROP"]
    default:
      throw new Error("getOpcodes Error")
  }
}

export function getTypeSignature(instruction: Instruction): TypeSignature {
  switch (instruction) {
    case "checkSig":
      return createTypeSignature(["PublicKey", "Signature"], "Boolean")
    case "older":
      return createTypeSignature(["Duration"], "Boolean")
    case "after":
      return createTypeSignature(["Time"], "Boolean")
    case "size":
      return createTypeSignature(["Bytes"], "Integer")
    case "substr":
      return createTypeSignature(["Bytes", "Integer", "Integer"], "Bytes")
    case "cat":
      return createTypeSignature(["Bytes", "Bytes"], "Bytes")
    case "min":
    case "max":
      return createTypeSignature(["Integer", "Integer"], "Integer")
    case "abs":
      return createTypeSignature(["Integer"], "Integer")
    case "within":
      return createTypeSignature(["Integer", "Integer", "Integer"], "Boolean")
    case "checkMultiSig":
      return createTypeSignature(
        [
          { type: "listType", elementType: "PublicKey" },
          { type: "listType", elementType: "Signature" }
        ],
        "Boolean"
      )
      case "<":
      case ">":
      case "<=":
      case ">=":
        return createTypeSignature(["Integer", "Integer"], "Boolean")  
      case "+":
      case "-":
      case "*":
      case "/":
      case "%":
      return createTypeSignature(["Integer", "Integer"], "Integer")  
      case "&":
      case "|":
      case "^":
      return createTypeSignature(["Bytes", "Bytes"], "Bytes")  
      case "&&":
      case "||":
      return createTypeSignature(["Boolean", "Boolean"], "Boolean")  
    case "==":
    case "!=":
      throw new Error("should not call getTypeSignature on " + instruction)
    case "ripemd160":
    case "sha1":
    case "sha256":
      throw new Error("should not call getTypeSignature on hash function")
    case "bytes":
      throw new Error("should not call getTypeSignature on bytes function")
    default:
      throw new Error("getTypeSignature Error")
  }
}
