import { optimize } from "./btc/optimize"
import { toContractParameter } from "./btc/parameters"
import toOpcodes from "./btc/toOpcodes"
import { desugarContract } from "./desugar"
import { NameError } from "./errors"
import { compileContractToIntermediate } from "./intermediate"
import { referenceCheck } from "./references"
import { compileStackOps } from "./stack"
import { CompilerError, Template, toTemplateClause } from "./template"
import { typeCheckContract } from "./typeCheck"

import { RawContract } from "./ast"

import { DEMO_CONTRACTS } from "./predefined"

const parser = require("./parser")

export function compileTemplate(
  source: string,
  importable = DEMO_CONTRACTS
): Template | CompilerError {
  try {
    const rawAst = parser.parse(source) as RawContract
    const referenceChecked = referenceCheck(rawAst)
    const ast = typeCheckContract(referenceChecked)
    const templateClauses = ast.clauses.map(toTemplateClause)
    const operations = compileStackOps(
      compileContractToIntermediate(desugarContract(ast))
    )
    const instructions = optimize(toOpcodes(operations))
    const params = ast.parameters.map(toContractParameter)
    return {
      type: "template",
      name: ast.name,
      instructions,
      clauses: templateClauses,
      clauseNames: templateClauses.map(clause => clause.name),
      params,
      source
    }
  } catch (e) {
    // catch and return CompilerError
    let errorMessage: string
    if (e.location !== undefined) {
      const start = e.location.start
      const name = e.name === "IvyTypeError" ? "TypeError" : e.name
      errorMessage =
        name +
        " at line " +
        start.line +
        ", column " +
        start.column +
        ": " +
        e.message
    } else {
      errorMessage = e.toString()
    }
    return {
      type: "compilerError",
      source,
      message: errorMessage
    }
  }
}
