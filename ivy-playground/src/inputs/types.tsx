import {
  ClauseParameter,
  ContractParameterHash,
  ContractParameterType,
  HashFunction,
  isHash
} from "ivy-bitcoin"

export {
  ContractParameterType,
  ContractParameterHash,
  isHash,
  HashFunction,
  ClauseParameter
}

export interface InputMap {
  [s: string]: Input
}

export type Input =
  | ParameterInput
  | BytesInput
  | HashInput
  | PublicKeyInput
  | NumberInput
  | BooleanInput
  | DurationInput
  | TimeInput
  | GenerateBytesInput
  | ProvideBytesInput
  | GenerateHashInput
  | ProvideHashInput
  | GeneratePublicKeyInput
  | ProvidePublicKeyInput
  | GeneratePrivateKeyInput
  | ProvidePrivateKeyInput
  | BlocksDurationInput
  | SecondsDurationInput
  | BlockheightTimeInput
  | TimestampTimeInput
  | SignatureInput
  | GenerateSignatureInput
  | ProvideSignatureInput
  | AddressInput
  | GenerateAddressInput
  | ProvideAddressInput
  | LockTimeInput
  | SequenceNumberInput
  | ValueInput

export type InputType =
  | "parameterInput"
  | "bytesInput"
  | "generateBytesInput"
  | "provideBytesInput"
  | "hashInput"
  | "generateHashInput"
  | "provideHashInput"
  | "publicKeyInput"
  | "generatePublicKeyInput"
  | "providePublicKeyInput"
  | "generatePrivateKeyInput"
  | "providePrivateKeyInput"
  | "numberInput"
  | "booleanInput"
  | "durationInput"
  | "blocksDurationInput"
  | "secondsDurationInput"
  | "timeInput"
  | "blockheightTimeInput"
  | "timestampTimeInput"
  | "signatureInput"
  | "generateSignatureInput"
  | "provideSignatureInput"
  | "addressInput"
  | "generateAddressInput"
  | "provideAddressInput"
  | "lockTimeInput"
  | "sequenceNumberInput"
  | "valueInput"

export type PrimaryInputType =
  | "bytesInput"
  | "hashInput"
  | "publicKeyInput"
  | "numberInput"
  | "booleanInput"
  | "durationInput"
  | "timeInput"
  | "signatureInput"
  | "valueInput"

export type InputContext =
  | "contractParameters"
  | "clauseParameters"
  | "transactionDetails"

export function getInputNameContext(name: string) {
  return name.split(".")[0] as InputContext
}

export function getInputContext(input: Input): InputContext {
  return getInputNameContext(input.name)
}

export interface ParameterInput {
  type: "parameterInput"
  value: PrimaryInputType
  valueType: ContractParameterType
  name: string
}

export function getParameterIdentifier(input: ParameterInput): string {
  switch (getInputContext(input)) {
    case "contractParameters":
      return input.name.split(".")[1]
    case "clauseParameters":
      return input.name.split(".")[2]
    default:
      throw new Error(
        "unexpected input for getParameterIdentifier: " + input.name
      )
  }
}

export interface BytesInput {
  type: "bytesInput"
  value: "provideBytesInput" | "generateBytesInput"
  name: string
}

export interface GenerateBytesInput {
  type: "generateBytesInput"
  value: string // length
  seed: string
  name: string
}

export interface ProvideBytesInput {
  type: "provideBytesInput"
  value: string
  name: string
}

export interface HashInput {
  type: "hashInput"
  hashType: ContractParameterHash
  value: "provideHashInput" | "generateHashInput"
  name: string
}

export interface GenerateHashInput {
  type: "generateHashInput"
  hashType: ContractParameterHash
  value: string
  name: string
}

export interface ProvideHashInput {
  type: "provideHashInput"
  hashFunction: HashFunction
  value: string
  name: string
}

export interface PublicKeyInput {
  type: "publicKeyInput"
  value: "providePublicKeyInput" | "generatePublicKeyInput"
  name: string
}

export interface ProvidePublicKeyInput {
  type: "providePublicKeyInput"
  value: string
  name: string
}

export interface ProvidePrivateKeyInput {
  type: "providePrivateKeyInput"
  value: string
  name: string
}

export interface GeneratePublicKeyInput {
  type: "generatePublicKeyInput"
  value: "generatePrivateKeyInput" | "providePrivateKeyInput"
  name: string
}

export interface GeneratePrivateKeyInput {
  type: "generatePrivateKeyInput"
  value: string // secret
  name: string
}

export interface NumberInput {
  type: "numberInput"
  value: string
  name: string
}

export interface BooleanInput {
  type: "booleanInput"
  value: "true" | "false"
  name: string
}

export interface DurationInput {
  type: "durationInput"
  value: "blocksDurationInput" | "secondsDurationInput"
  name: string
}

export interface BlocksDurationInput {
  type: "blocksDurationInput"
  value: string
  name: string
}

export interface SecondsDurationInput {
  type: "secondsDurationInput"
  value: string
  name: string
}

export interface TimeInput {
  type: "timeInput"
  value: "blockheightTimeInput" | "timestampTimeInput"
  name: string
}

export interface BlockheightTimeInput {
  type: "blockheightTimeInput"
  value: string
  name: string
}

export interface TimestampTimeInput {
  type: "timestampTimeInput"
  value: string
  name: string
}

// signatures and addresses are only clause inputs, for now

export interface SignatureInput {
  type: "signatureInput"
  value: "generateSignatureInput" | "provideSignatureInput"
  name: string
}

export interface ProvideSignatureInput {
  type: "provideSignatureInput"
  value: string
  name: string
}

export interface GenerateSignatureInput {
  type: "generateSignatureInput"
  value: "providePrivateKeyInput" // (for now this is the only option)
  name: string
}

export interface AddressInput {
  type: "addressInput"
  value: "generateAddressInput" | "provideAddressInput"
  name: string
}

export interface GenerateAddressInput {
  type: "generateAddressInput"
  value: "generatePrivateKeyInput" | "providePrivateKeyInput"
  name: string
}

export interface ProvideAddressInput {
  type: "provideAddressInput"
  value: string
  name: string
}

export interface LockTimeInput {
  type: "lockTimeInput"
  value: string // always "timeInput"
  name: string
}

export interface SequenceNumberInput {
  type: "sequenceNumberInput"
  value: string // always "durationInput"
  name: string
}

export interface ValueInput {
  type: "valueInput"
  value: string
  name: string
  units: "satoshis" | "BTC"
}

export function getChild(input: ComplexInput): string {
  return input.name + "." + input.value
}

export type ComplexInput =
  | BytesInput
  | HashInput
  | GenerateHashInput
  | PublicKeyInput
  | DurationInput
  | TimeInput
  | ParameterInput
  | GeneratePublicKeyInput
  | SignatureInput
  | GenerateSignatureInput
  | AddressInput
  | GenerateAddressInput
  | LockTimeInput
  | SequenceNumberInput

export function isPrimaryInputType(str: string): str is PrimaryInputType {
  switch (str) {
    case "hashInput":
    case "numberInput":
    case "booleanInput":
    case "bytesInput":
    case "publicKeyInput":
    case "durationInput":
    case "timeInput":
    case "signatureInput":
    case "valueInput":
      return true
    default:
      return false
  }
}

export function isComplexType(inputType: InputType) {
  switch (inputType) {
    case "parameterInput":
    case "generateHashInput":
    case "hashInput":
    case "bytesInput":
    case "publicKeyInput":
    case "durationInput":
    case "timeInput":
    case "generatePublicKeyInput":
    case "generateSignatureInput":
    case "signatureInput":
    case "addressInput":
    case "lockTimeInput":
    case "sequenceNumberInput":
      return true
    default:
      return false
  }
}

export function isComplexInput(input: Input): input is ComplexInput {
  return isComplexType(input.type)
}

export function getInputType(type: ContractParameterType): PrimaryInputType {
  if (isHash(type)) {
    return "hashInput"
  }
  switch (type) {
    case "Boolean":
      return "booleanInput"
    case "Bytes":
      return "bytesInput"
    case "PublicKey":
      return "publicKeyInput"
    case "Duration":
      return "durationInput"
    case "Time":
      return "timeInput"
    case "Signature":
      return "signatureInput"
    case "Value":
      return "valueInput"
  }
}
