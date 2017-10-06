import { Hash, HashFunction, isHash, isList, Type, typeToString } from "./types"

import { Parameter } from "../ast"

import { BugError } from "../errors"

export interface ContractParameterHash {
  type: "hashType"
  inputType: "Bytes" | "PublicKey" | ContractParameterHash
  hashFunction: HashFunction
}

export type ContractParameterType =
  | "PublicKey"
  | "Bytes"
  | "Time"
  | "Duration"
  | "Boolean"
  | "Signature"
  | "Value"
  | ContractParameterHash

export interface ContractParameter {
  type: "contractParameter"
  valueType: ContractParameterType
  name: string
}

export interface ClauseParameter {
  type: "clauseParameter"
  valueType: ContractParameterType
  name: string
}

export function isContractParameterHash(
  type: Hash
): type is ContractParameterHash {
  return isContractParameterType(type.inputType)
}

export function isContractParameterType(
  type: Type
): type is ContractParameterType {
  if (type === "Signature" || isList(type)) {
    return false
  }
  if (isHash(type)) {
    return isContractParameterHash(type)
  } else {
    return true
  }
}

export function toContractParameter(parameter: Parameter): ContractParameter {
  if (!isContractParameterType(parameter.itemType)) {
    throw new BugError(
      "invalid contract parameter type for " +
        parameter.name +
        ": " +
        typeToString(parameter.itemType)
    )
  }
  const contractParameter: ContractParameter = {
    type: "contractParameter",
    valueType: parameter.itemType,
    name: parameter.name
  }
  return contractParameter
}

export function isClauseParameterHash(
  type: Hash
): type is ContractParameterHash {
  return isClauseParameterType(type.inputType)
}

export function isClauseParameterType(
  type: Type
): type is ContractParameterHash {
  if (isHash(type)) {
    return isClauseParameterHash(type)
  }
  if (type === "Signature") {
    return true
  }
  return isContractParameterType(type)
}

export function toClauseParameter(parameter: Parameter): ClauseParameter {
  if (!isClauseParameterType(parameter.itemType)) {
    throw new BugError(
      "invalid contract parameter type for " +
        parameter.name +
        ": " +
        typeToString(parameter.itemType)
    )
  }
  const clauseParameter: ClauseParameter = {
    type: "clauseParameter",
    valueType: parameter.itemType,
    name: parameter.name
  }
  return clauseParameter
}
