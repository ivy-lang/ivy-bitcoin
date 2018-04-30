import { expect } from 'chai'
import 'mocha'
import { RawContract } from "../ast"
import { referenceCheck } from "../references"
import { typeCheckContract } from "../typeCheck"

const parser = require("../parser")


const source = "contract LockWithPublicKey(val: Value){clause spend(data:PublicKey) {verify data + 1 unlock val}}"

describe('Type check', () => {
  it('', () => {
    const rawAst = parser.parse(source) as RawContract
    const referenceChecked = referenceCheck(rawAst)
    const ast = typeCheckContract(referenceChecked)
    expect(ast.clauses[0].statements).to.equal([])
  })

})
