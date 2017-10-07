import * as assert from "assert"
import { expect } from "chai"
import "mocha"
import {
  CompilerError,
  compileTemplate,
  fulfill,
  instantiate,
  spend,
  Template
} from "../index"
import {
  ERRORS,
  TEST_CASES,
  TEST_CONTRACT_AGES,
  TEST_CONTRACT_ARGS,
  TEST_CONTRACT_CLAUSE_NAMES,
  TEST_CONTRACT_TIMES,
  TEST_SPEND_ARGUMENTS
} from "../predefined"

describe("compileTemplate", () => {
  Object.keys(TEST_CASES).forEach(name => {
    it("should compile " + name, () => {
      const contractSource = TEST_CASES[name]
      const compiled = compileTemplate(contractSource)
      expect((compiled as CompilerError).message).to.equal(undefined) // so it prints the error
    })
  })
  Object.keys(ERRORS).forEach(errorName => {
    it("should throw an error if contract " + errorName, () => {
      const errorContractSource = ERRORS[errorName]
      const compiled = compileTemplate(errorContractSource) as CompilerError
      expect(compiled.type).to.equal("compilerError")
    })
  })
})

describe("instantiate", () => {
  Object.keys(TEST_CONTRACT_ARGS).forEach(id => {
    it("should instantiate " + id, () => {
      const template = compileTemplate(TEST_CASES[id]) as Template
      const instantiated = instantiate(template, TEST_CONTRACT_ARGS[id])
    })
  })
})

const seed = Buffer.from("", "hex")
const destinationAddress = ""

function createTestSpendTransaction(id: string) {
  const template = compileTemplate(TEST_CASES[id]) as Template
  const instantiated = instantiate(template, TEST_CONTRACT_ARGS[id], seed)
  const spendTx = spend(
    instantiated.fundingTransaction,
    destinationAddress,
    0,
    0,
    { sequence: 0, seconds: false }
  )
}

describe("spend", () => {
  Object.keys(TEST_SPEND_ARGUMENTS).forEach(id => {
    it("should create spend transaction for " + id, () => {
      const template = compileTemplate(TEST_CASES[id]) as Template
      const instantiated = instantiate(template, TEST_CONTRACT_ARGS[id], seed)
      const spendTx = spend(
        instantiated.fundingTransaction,
        destinationAddress,
        0,
        0,
        { sequence: 0, seconds: false }
      )
    })
  })
})

describe("fulfill", () => {
  Object.keys(TEST_SPEND_ARGUMENTS).forEach(id => {
    it("should be able to fulfill the spend transaction for " + id, () => {
      const template = compileTemplate(TEST_CASES[id]) as Template
      const instantiated = instantiate(template, TEST_CONTRACT_ARGS[id], seed)
      const spendTx = spend(
        instantiated.fundingTransaction,
        destinationAddress,
        0,
        TEST_CONTRACT_TIMES[id] || 0,
        { sequence: TEST_CONTRACT_AGES[id] || 0, seconds: false }
      )
      const fulfilled = fulfill(
        instantiated,
        spendTx,
        TEST_SPEND_ARGUMENTS[id],
        TEST_CONTRACT_CLAUSE_NAMES[id]
      )
      fulfilled.check()
    })
  })
})
