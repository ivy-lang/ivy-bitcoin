import { expect } from 'chai'
import 'mocha'
import { RawContract } from "../ast"

const parser = require("../parser")

const source = "contract LockWithPublicKey(publicKey: PublicKey, val: Value){clause spend(sig: Signature) {verify within(1,3,4) unlock val}}"

describe('Parameter function', () => {
  it('should have length 2', () => {
    const rawAst = parser.parse(source) as RawContract
    const parameters = rawAst.parameters
    const clauses = rawAst.clauses
    const statement = clauses[0].statements
    expect(parameters.length).to.equal(2)
    expect(statement).to.equal([])

  })

})
