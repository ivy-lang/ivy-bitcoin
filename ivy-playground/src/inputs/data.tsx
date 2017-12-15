import {
  ClauseParameter,
  ContractParameterHash,
  createSignature,
  crypto,
  isHash
} from "ivy-bitcoin"

import {
  ContractParameterType,
  GenerateBytesInput,
  GenerateHashInput,
  getChild,
  getInputNameContext,
  getInputType,
  HashInput,
  Input,
  InputContext,
  InputMap,
  InputType,
  isComplexInput,
  isPrimaryInputType,
  ParameterInput,
  ProvideHashInput
} from "./types"

import * as momentImport from "moment"

// weird workaround
const moment =
  typeof (momentImport as any).default === "function"
    ? (momentImport as any).default
    : momentImport

const MIN_TIMESTAMP = 500000000
const MAX_NUMBER = 2147483647
const MIN_NUMBER = -2147483647
const MAX_UINT32 = 4294967295
const MAX_UINT16 = 65535

function validateHex(str: string): boolean {
  return /^([a-f0-9][a-f0-9])*$/.test(str)
}

export const isValidInput = (id: string, inputMap: InputMap): boolean => {
  const input = inputMap[id]
  switch (input.type) {
    case "parameterInput":
    case "bytesInput":
    case "hashInput":
    case "publicKeyInput":
    case "timeInput":
    case "signatureInput":
    case "generateHashInput":
    case "generatePublicKeyInput":
      return isValidInput(getChild(input), inputMap)
    default:
      return validateInput(input)
  }
}

export function isValidBTC(value: string) {
  return (
    value !== "" &&
    /^(\d+)?(\.\d{0,8})?$/.test(value) &&
    parseFloat(value) <= 21000000
  )
}

export function validateInput(input: Input): boolean {
  // validates that an individual input is valid
  // does not validate child inputs
  switch (input.type) {
    case "parameterInput":
    case "generateHashInput":
      return isPrimaryInputType(input.value)
    case "addressInput":
      return (
        input.value === "generateAddressInput" ||
        input.value === "provideAddressInput"
      )
    case "bytesInput":
      return (
        input.value === "generateBytesInput" ||
        input.value === "provideBytesInput"
      )
    case "hashInput":
      return (
        input.value === "generateHashInput" ||
        input.value === "provideHashInput"
      )
    case "publicKeyInput":
      return (
        input.value === "providePublicKeyInput" ||
        input.value === "generatePublicKeyInput"
      )
    case "generatePublicKeyInput":
      return (
        input.value === "generatePrivateKeyInput" ||
        input.value === "providePrivateKeyInput"
      )
    case "durationInput":
      return (
        input.value === "secondsDurationInput" ||
        input.value === "blocksDurationInput"
      )
    case "timeInput":
      return (
        input.value === "timestampTimeInput" ||
        input.value === "blockheightTimeInput"
      )
    case "generatePublicKeyInput":
    case "generateAddressInput":
      return (
        input.value === "generatePrivateKeyInput" ||
        input.value === "providePrivateKeyInput"
      )
    case "signatureInput":
      return (
        input.value === "generateSignatureInput" ||
        input.value === "provideSignatureInput"
      )
    case "generateSignatureInput":
      return input.value === "providePrivateKeyInput"
    case "provideBytesInput":
      return validateHex(input.value)
    case "provideHashInput":
      if (!validateHex(input.value)) {
        return false
      }
      switch (input.hashFunction) {
        case "sha256":
          return input.value.length === 64
        case "sha1":
        case "ripemd160":
          return input.value.length === 40
      }
    case "generatePrivateKeyInput":
    case "providePrivateKeyInput":
      try {
        const kr = crypto.fromSecret(input.value)
        return true
      } catch (e) {
        return false
      }
    case "provideAddressInput":
      try {
        // const address = Address.fromBase58(input.value)
        return true
      } catch (e) {
        return false
      }
    case "providePublicKeyInput":
      try {
        const buf = Buffer.from(input.value, "hex")
        const kr = crypto.fromPublic(buf)
        return true
      } catch (e) {
        return false
      }
    case "provideSignatureInput": {
      if (!validateHex(input.value)) {
        return false
      }
      const buf = Buffer.from(input.value.slice(0, -2), "hex")
      try {
        const sig = crypto.fromDER(buf)
        return true
      } catch (e) {
        return false
      }
    }
    case "generateBytesInput": {
      const length = parseInt(input.value, 10)
      if (isNaN(length) || length < 0 || length > 520) {
        return false
      }
      return input.seed.length === 1040
    }
    case "booleanInput":
      return input.value === "true" || input.value === "false"
    case "timestampTimeInput":
      const timestamp = Date.parse(input.value + "Z") / 1000
      if (
        isNaN(timestamp) ||
        timestamp < MIN_TIMESTAMP ||
        timestamp > MAX_UINT32
      ) {
        return false
      }
      return true
    case "numberInput":
    case "blockheightTimeInput":
    case "secondsDurationInput":
    case "blocksDurationInput":
      if (!/^\-?\d+$/.test(input.value)) {
        return false
      }
      const numberValue = parseInt(input.value, 10)
      switch (input.type) {
        case "numberInput":
          return numberValue >= MIN_NUMBER && numberValue <= MAX_NUMBER
        case "blockheightTimeInput":
          return numberValue >= 0 && numberValue < MIN_TIMESTAMP
        case "secondsDurationInput":
        case "blocksDurationInput":
          return numberValue >= 0 && numberValue <= MAX_UINT16
        default:
          throw new Error("unexpectedly reached end of switch statement")
      }
    case "valueInput": {
      return isValidBTC(input.value)
    }
    case "lockTimeInput":
      return input.value === "timeInput"
    case "sequenceNumberInput":
      return input.value === "durationInput"
  }
}

export function getSequence(inputsById: { [s: string]: Input }) {
  const durationInput =
    inputsById["transactionDetails.sequenceNumberInput.durationInput"]
  if (durationInput.value === "secondsDurationInput") {
    const input =
      inputsById[
        "transactionDetails.sequenceNumberInput.durationInput.secondsDurationInput"
      ]
    if (!validateInput(input)) {
      throw new Error("invalid sequence number")
    }
    const val = input.value
    const seq = parseInt(val, 10) << 9
    return { sequence: seq, seconds: true }
  } else {
    const input =
      inputsById[
        "transactionDetails.sequenceNumberInput.durationInput.blocksDurationInput"
      ]
    if (!validateInput(input)) {
      throw new Error("invalid sequence number")
    }
    const val = input.value
    return { sequence: parseInt(val, 10), seconds: false }
  }
}

export function getData(
  inputId: string,
  inputsById: { [s: string]: Input },
  sigHash?: Buffer
): Buffer | number {
  const input = inputsById[inputId]
  if (!validateInput(input)) {
    throw new Error("invalid input: " + input.name)
  }
  switch (input.type) {
    case "parameterInput":
    case "bytesInput":
    case "hashInput":
    case "publicKeyInput":
    case "durationInput":
    case "timeInput":
    case "signatureInput":
    case "lockTimeInput":
    case "sequenceNumberInput":
      return getData(getChild(input), inputsById, sigHash)
    case "provideBytesInput":
    case "providePublicKeyInput":
    case "provideHashInput":
    case "provideSignatureInput": {
      return Buffer.from(input.value, "hex")
    }
    case "generatePublicKeyInput": {
      const publicKeyValue = getPublicKeyValue(inputId, inputsById)
      return Buffer.from(publicKeyValue, "hex")
    }
    case "numberInput": {
      return parseInt(input.value, 10)
    }
    case "booleanInput": {
      return input.value === "true" ? 1 : 0
    }
    case "valueInput": {
      return Math.round(parseFloat(input.value) * 100000000)
    }
    case "blocksDurationInput":
    case "secondsDurationInput": {
      let numValue = parseInt(input.value, 10)
      if (input.type === "secondsDurationInput") {
        numValue = numValue | (1 << 22)
      } // set the flag
      return numValue
    }
    case "timestampTimeInput": {
      const numValue = Date.parse(input.value + "Z") / 1000
      return numValue
    }
    case "blockheightTimeInput": {
      const numValue = parseInt(input.value, 10)
      return numValue
    }
    case "generateBytesInput": {
      const generated = getGenerateBytesInputValue(input)
      return Buffer.from(generated, "hex")
    }
    case "generateHashInput": {
      const childData = getData(getChild(input), inputsById, sigHash)
      if (typeof childData === "number") {
        throw new Error("should not generate hash of a number")
      }
      switch (input.hashType.hashFunction) {
        case "sha1":
          return crypto.sha1(childData)
        case "sha256":
          return crypto.sha256(childData)
        case "ripemd160":
          return crypto.ripemd160(childData)
        default:
          throw new Error("unexpected hash function")
      }
    }
    case "generateSignatureInput": {
      const privKey = getPrivateKeyValue(inputId, inputsById)
      if (sigHash === undefined) {
        throw new Error("no sigHash provided to generateSignatureInput")
      }
      const sig = createSignature(sigHash, privKey)
      if (sig === undefined) {
        throw new Error("invalid private key")
      }
      return sig
    }
    default:
      throw new Error("should not call getData with " + input.type)
  }
}

export function getPublicKeyValue(
  inputId: string,
  inputsById: { [s: string]: Input }
) {
  const privateKeyValue = getPrivateKeyValue(inputId, inputsById)
  const kr = crypto.fromSecret(privateKeyValue)
  return kr.getPublicKey("hex")
}

export function getPrivateKeyValue(
  inputId: string,
  inputsById: { [s: string]: Input }
) {
  const input = inputsById[inputId]
  if (
    input === undefined ||
    (input.type !== "generatePublicKeyInput" &&
      input.type !== "generateSignatureInput")
  ) {
    throw new Error("unexpected input")
  }
  const privateKeyInput = inputsById[getChild(input)]
  if (privateKeyInput === undefined) {
    throw new Error("private key input unexpectedly missing")
  }
  return privateKeyInput.value
}

export function getGenerateBytesInputValue(input: GenerateBytesInput) {
  const length = parseInt(input.value, 10)
  if (isNaN(length) || length < 0 || length > 520) {
    throw new Error(
      "invalid length value for generateBytesInput: " + input.value
    )
  }
  return input.seed.slice(0, length * 2) // dumb, for now
}

function getGenerateAddressValue(
  inputId: string,
  inputsById: { [s: string]: Input }
) {
  const input = inputsById[inputId]
  if (input === undefined || input.type !== "generateAddressInput") {
    throw new Error("unexpected input")
  }
  const privateKeyInput = inputsById[getChild(input)]
  if (privateKeyInput === undefined) {
    throw new Error("private key input unexpectedly missing")
  }
  const kr = crypto.fromSecret(privateKeyInput.value)
  return kr.getAddress("base58")
}

export function computeDataForInput(
  inputId: string,
  inputsById: { [s: string]: Input }
): string {
  const input = inputsById[inputId]
  const data = getData(inputId, inputsById)
  if (typeof data === "number") {
    throw new Error("should not get data for a number")
  }
  return data.toString("hex")
}

export function getDefaultContractParameterValue(inputType: InputType): string {
  switch (inputType) {
    case "parameterInput":
    case "generateHashInput":
    case "lockTimeInput":
    case "sequenceNumberInput":
    case "addressInput":
    case "generateAddressInput":
    case "provideAddressInput":
      throw new Error(
        "getDefaultContractParameterValue should not be called on " + inputType
      )
    case "booleanInput":
      return "false"
    case "generateBytesInput":
      return "32"
    case "numberInput":
    case "blocksDurationInput":
    case "secondsDurationInput":
    case "blockheightTimeInput":
      return "0"
    case "timestampTimeInput":
      const date = moment().subtract(15, "minutes")
      const dateString = date.toISOString().slice(0, -10) + "00:00"
      return dateString // "2018-01-01T00:00"
    case "provideBytesInput":
    case "provideHashInput":
    case "providePublicKeyInput":
    case "providePrivateKeyInput":
    case "provideSignatureInput":
      return ""
    case "generatePrivateKeyInput":
      const key = crypto.privateKey.generate()
      const kr = crypto.fromPrivate(key.privateKey)
      return kr.toSecret()
    case "bytesInput":
      return "generateBytesInput"
    case "hashInput":
      return "generateHashInput"
    case "generatePublicKeyInput":
      return "generatePrivateKeyInput"
    case "publicKeyInput":
      return "generatePublicKeyInput"
    case "signatureInput":
      return "generateSignatureInput"
    case "generateSignatureInput":
      return "providePrivateKeyInput"
    case "booleanInput":
      return "false"
    case "durationInput":
      return "blocksDurationInput"
    case "timeInput":
      return "blockheightTimeInput"
    case "valueInput":
      return "0"
  }
}

export function getDefaultTransactionDetailValue(inputType: InputType): string {
  switch (inputType) {
    case "lockTimeInput":
      return "timeInput"
    case "sequenceNumberInput":
      return "durationInput"
    case "provideAddressInput":
      return ""
    case "addressInput":
      return "generateAddressInput"
    case "generateAddressInput":
      return "generatePrivateKeyInput"
    default:
      // fall back for now
      return getDefaultContractParameterValue(inputType)
  }
}

export function getDefaultClauseParameterValue(inputType: InputType): string {
  switch (inputType) {
    case "parameterInput":
    case "generateHashInput":
    case "addressInput":
    case "generateAddressInput":
    case "provideAddressInput":
    case "lockTimeInput":
    case "sequenceNumberInput":
    case "valueInput":
      throw new Error(
        "getDefaultClauseParameterValue should not be called on " + inputType
      )
    case "booleanInput":
      return "false"
    case "generateBytesInput":
      return "32"
    case "numberInput":
    case "blocksDurationInput":
    case "secondsDurationInput":
    case "blockheightTimeInput":
      return "0"
    case "timestampTimeInput":
      return "2018-01-01T00:00"
    case "provideBytesInput":
    case "provideHashInput":
    case "providePublicKeyInput":
    case "providePrivateKeyInput":
    case "provideSignatureInput":
      return ""
    case "generatePrivateKeyInput":
      const key = crypto.privateKey.generate()
      const kr = crypto.fromPrivate(key.privateKey)
      return kr.toSecret()
    case "bytesInput":
      return "provideBytesInput"
    case "hashInput":
      return "provideHashInput"
    case "publicKeyInput":
      return "providePublicKeyInput"
    case "signatureInput":
      return "generateSignatureInput"
    case "generatePublicKeyInput":
    case "generateSignatureInput":
      return "providePrivateKeyInput"
    case "booleanInput":
      return "false"
    case "durationInput":
      return "blocksDurationInput"
    case "timeInput":
      return "blockheightTimeInput"
  }
}

export function getDefaultValue(inputType, name): string {
  switch (getInputNameContext(name)) {
    case "clauseParameters":
      return getDefaultClauseParameterValue(inputType)
    case "contractParameters":
      return getDefaultContractParameterValue(inputType)
    case "transactionDetails":
      return getDefaultTransactionDetailValue(inputType)
  }
}

export function addDefaultInput(
  inputs: Input[],
  inputType: InputType,
  parentName
) {
  const name = parentName + "." + inputType
  const value = getDefaultValue(inputType, name)
  switch (inputType) {
    case "generateBytesInput": {
      const seed = crypto.randomBytes(520).toString("hex")
      inputs.push({
        type: "generateBytesInput",
        value: value as any,
        seed,
        name
      })
      break
    }
    default:
      inputs.push({
        type: inputType as any,
        value,
        name
      })
  }
  switch (inputType) {
    case "bytesInput": {
      addDefaultInput(inputs, "generateBytesInput", name)
      addDefaultInput(inputs, "provideBytesInput", name)
      return
    }
    case "publicKeyInput": {
      addDefaultInput(inputs, "generatePublicKeyInput", name)
      addDefaultInput(inputs, "providePublicKeyInput", name)
      return
    }
    case "generatePublicKeyInput":
    case "generateAddressInput": {
      addDefaultInput(inputs, "generatePrivateKeyInput", name)
      addDefaultInput(inputs, "providePrivateKeyInput", name)
    }
    case "timeInput": {
      addDefaultInput(inputs, "blockheightTimeInput", name)
      addDefaultInput(inputs, "timestampTimeInput", name)
      return
    }
    case "durationInput": {
      addDefaultInput(inputs, "blocksDurationInput", name)
      addDefaultInput(inputs, "secondsDurationInput", name)
      return
    }
    case "signatureInput": {
      addDefaultInput(inputs, "generateSignatureInput", name)
      addDefaultInput(inputs, "provideSignatureInput", name)
      return
    }
    case "generateSignatureInput": {
      addDefaultInput(inputs, "providePrivateKeyInput", name)
      return
    }
    case "addressInput": {
      addDefaultInput(inputs, "generateAddressInput", name)
      addDefaultInput(inputs, "provideAddressInput", name)
      return
    }
    case "lockTimeInput": {
      addDefaultInput(inputs, "timeInput", name)
      return
    }
    case "sequenceNumberInput": {
      addDefaultInput(inputs, "durationInput", name)
      return
    }
    default:
      return
  }
}

function addHashInputs(
  inputs: Input[],
  type: ContractParameterHash,
  parentName: string
) {
  const name = parentName + ".generateHashInput"
  const value = getInputType(type.inputType)
  const generateHashInput: GenerateHashInput = {
    type: "generateHashInput",
    hashType: type,
    value,
    name
  }
  inputs.push(generateHashInput)
  addInputForType(inputs, type.inputType, name)

  const hashType = generateHashInput.hashType.inputType

  const provideHashInput: ProvideHashInput = {
    type: "provideHashInput",
    hashFunction: type.hashFunction,
    value: "",
    name: parentName + ".provideHashInput"
  }
  inputs.push(provideHashInput)
}

function addHashInput(
  inputs: Input[],
  type: ContractParameterHash,
  parentName: string
) {
  const name = parentName + ".hashInput"
  const hashInput: HashInput = {
    type: "hashInput",
    hashType: type,
    value: "generateHashInput",
    name
  }
  inputs.push(hashInput)
  addHashInputs(inputs, type, name)
}

function addInputForType(
  inputs: Input[],
  parameterType: ContractParameterType,
  parentName: string
) {
  if (isHash(parameterType)) {
    addHashInput(inputs, parameterType, parentName)
  } else {
    addDefaultInput(inputs, getInputType(parameterType), parentName)
  }
}

export function addParameterInput(
  inputs: Input[],
  valueType: ContractParameterType,
  name: string
) {
  const inputType = getInputType(valueType)
  const parameterInput: ParameterInput = {
    type: "parameterInput",
    value: inputType,
    valueType,
    name
  }
  inputs.push(parameterInput)
  addInputForType(inputs, valueType, name)
}

export const getInputContext = (input: Input): InputContext => {
  return getInputNameContext(input.name)
}

export const getParameterIdentifier = (input: ParameterInput): string => {
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
