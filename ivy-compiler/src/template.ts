import {
  ClauseParameter,
  ContractParameter,
  toClauseParameter
} from "./btc/parameters"

import { Clause } from "./ast"

export interface Template {
  type: "template"
  source: string
  name: string
  clauses: TemplateClause[]
  clauseNames: string[]
  instructions: string[]
  params: ContractParameter[]
}

export interface CompilerError {
  type: "compilerError"
  source: string
  message: string
}

export interface TemplateClause {
  type: "templateClause"
  name: string
  parameters: ClauseParameter[]
}

export function toTemplateClause(clause: Clause): TemplateClause {
  const clauseParameters = clause.parameters.map(toClauseParameter)
  return {
    type: "templateClause",
    name: clause.name,
    parameters: clauseParameters
  }
}
