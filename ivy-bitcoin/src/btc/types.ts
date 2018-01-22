import { BugError } from "../errors"

export type Type = Primitive | Hash | List

export type Primitive =
  | "PublicKey"
  | "Signature"
  | "Bytes"
  | "Time"
  | "Duration"
  | "Value"
  | "Boolean"
  | "Integer"

export type HashFunction = "sha1" | "sha256" | "ripemd160"

export interface Hash {
  type: "hashType"
  hashFunction: HashFunction
  inputType: Type
}

export interface List {
  type: "listType"
  elementType: Type
}

export type TypeClass = "Primitive" | "Hash" | "List" | "BooleanType"

export interface TypeSignature {
  type: "typeSignature"
  inputs: Type[]
  output: Type
}

export function createTypeSignature(
  inputs: Type[],
  output: Type
): TypeSignature {
  return {
    type: "typeSignature",
    inputs,
    output
  }
}

export function inputTypesToString(inputTypes: Type[]) {
  return "(" + inputTypes.map(type => typeToString(type)).join(", ") + ")"
}

export function isPrimitive(str: Type | string): str is Primitive {
  switch (str) {
    case "PublicKey":
    case "Signature":
    case "Bytes":
    case "Time":
    case "Duration":
    case "Boolean":
    case "Integer":
    case "Value":
      return true
    default:
      return false
  }
}

export function isHashTypeName(str) {
  switch (str) {
    case "Sha1":
    case "Sha256":
    case "Ripemd160":
      return true
    default:
      return false
  }
}

export function isHash(type: Type): type is Hash {
  return typeof type === "object" && type.type === "hashType"
}

export function isList(type: Type): type is List {
  return typeof type === "object" && type.type === "listType"
}

export function isTypeClass(type: Type | TypeClass): type is TypeClass {
  return (
    type === "Primitive" ||
    type === "TypeVariable" ||
    type === "Hash" ||
    type === "List"
  )
}

export function getTypeClass(type: Type): TypeClass {
  if (isPrimitive(type)) {
    return "Primitive"
  } else if (isHash(type)) {
    return "Hash"
  } else if (isList(type)) {
    return "List"
  } else {
    throw new BugError("unknown typeclass: " + typeToString(type))
  }
}

export function isHashFunctionName(str: string): str is HashFunction {
  switch (str) {
    case "sha1":
    case "sha256":
    case "ripemd160":
      return true
    default:
      return false
  }
}

export function hashFunctionToTypeName(hash: HashFunction): string {
  switch (hash) {
    case "sha1":
      return "Sha1"
    case "sha256":
      return "Sha256"
    case "ripemd160":
      return "Ripemd160"
    default:
      throw new Error("unknown hash function")
  }
}

export function typeNameToHashFunction(hash: string): HashFunction {
  switch (hash) {
    case "Sha1":
      return "sha1"
    case "Sha256":
      return "sha256"
    case "Ripemd160":
      return "ripemd160"
    default:
      throw new Error("unknown type name")
  }
}

export function typeToString(type: Type): string {
  if (type === undefined) {
    throw new BugError("undefined passed to typeToString()")
  }
  if (typeof type === "object") {
    switch (type.type) {
      case "hashType":
        return (
          hashFunctionToTypeName(type.hashFunction) +
          "(" +
          typeToString(type.inputType) +
          ")"
        )
      case "listType":
        return "List(" + typeToString(type.elementType) + ")"
      default:
        throw new BugError("unknown type")
    }
  } else {
    return type
  }
}
