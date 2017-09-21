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
    console.log("raw ast", rawAst)
    const referenceChecked = referenceCheck(rawAst)
    const imports = rawAst.imports.map(imp => {
      const name = imp.name
      if (importable[name] === undefined) {
        throw new NameError("could not find contract: " + name)
      }
      const compiled = compileTemplate(importable[name])
      if (compiled.type === "compilerError") {
        throw new Error(
          "error in importable contract " + name + ": " + compiled.message
        )
      }
      if (compiled.name !== name) {
        throw new NameError(
          "name of importable contract " +
            name +
            " does not match declared name " +
            compiled.name
        )
      }
      return compiled
    })
    const importMap = {}
    for (const imp of imports) {
      importMap[imp.name] = imp
    }
    const ast = typeCheckContract(referenceChecked, importMap)
    console.log("ast", ast)
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
