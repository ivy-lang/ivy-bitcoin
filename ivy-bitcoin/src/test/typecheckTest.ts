import { expect } from 'chai'
import 'mocha'
import { RawContract } from "../ast"
import { optimize } from "../btc/optimize"
import toOpcodes from "../btc/toOpcodes"
import { desugarContract } from "../desugar"
import { compileContractToIntermediate } from "../intermediate"
import { referenceCheck } from "../references"
import { compileStackOps } from "../stack"
import { CompilerError, Template, toTemplateClause } from "../template"
import { typeCheckContract } from "../typeCheck"

const parser = require("../parser")


const source = "contract LockWithPublicKey(val: Value){clause spend() {verify !(1==1) unlock val}}"

describe('Type check', () => {
  it('', () => {
    const rawAst = parser.parse(source) as RawContract
    const referenceChecked = referenceCheck(rawAst)
    const ast = typeCheckContract(referenceChecked)
    const templateClauses = ast.clauses.map(toTemplateClause)
    const operations = compileStackOps(
      compileContractToIntermediate(desugarContract(ast))
    )
    const instructions = optimize(toOpcodes(operations))

    
    expect(instructions).to.equal([])
  })

})
