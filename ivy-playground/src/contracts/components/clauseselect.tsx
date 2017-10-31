// external imports
import React from "react"
import { connect } from "react-redux"

// internal imports
import { TemplateClause } from "../../templates/types"
import { setClauseIndex } from "../actions"
import {
  getSelectedClauseIndex,
  getSpendContract,
  getSpendContractId
} from "../selectors"

const ClauseSelect = (props: {
  contractId: string
  clauses: TemplateClause[]
  setClauseIndex: (n: number) => undefined
  spendIndex: number
}) => {
  return (
    <section>
      <h4>Clause</h4>
      <select
        className="form-control"
        value={props.spendIndex}
        onChange={e => props.setClauseIndex(parseInt(e.target.value, 10))}
      >
        {props.clauses.map((clause, i) => (
          <option key={clause.name} value={i}>
            {clause.name}
          </option>
        ))}
      </select>
    </section>
  )
}

export default connect(
  state => ({
    spendIndex: getSelectedClauseIndex(state),
    clauses: getSpendContract(state).template.clauses,
    contractId: getSpendContractId(state)
  }),
  { setClauseIndex }
)(ClauseSelect)
