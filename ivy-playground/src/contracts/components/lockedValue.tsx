// external imports
import React from "react"
import { Col, Grid, Row } from "react-bootstrap"
import DocumentTitle from "react-document-title"
import { connect } from "react-redux"
import { Link } from "react-router-dom"

// ivy imports
import Section from "../../app/components/section"

// internal imports
import { getContract, getContractIds, getSpentContractIds } from "../selectors"
import { Contract } from "../types"

import { setUnlockContract } from "../actions"

// import ivy-plugin css
import '../../static/bootstrap.css'
import '../../static/ivy-plugin.css'

function amountFromSatoshis(amountInSatoshis: number) {
  const amount = amountInSatoshis / 100000000
  return amount
}

const LockedValueDisplay = (props: {
  contractIds: string[]
  spentContractIds: string[]
}) => {
  return (
    <DocumentTitle title="Unlock Contract">
      <div>
        <LockedValue contractIds={props.contractIds} />
        <History spentContractIds={props.spentContractIds} />
      </div>
    </DocumentTitle>
  )
}

export default connect(state => ({
  contractIds: getContractIds(state),
  spentContractIds: getSpentContractIds(state)
}))(LockedValueDisplay)

const UnlockButtonUnconnected = (props: { contractId: string, unlock: () => undefined }) => {
  return (
    <button onClick={props.unlock} className="btn btn-primary">Unlock</button>
  )
}

const UnlockButton = connect(
  undefined,
  (dispatch, ownProps) => {
    return {
      unlock: () => dispatch(setUnlockContract(ownProps.contractId))
    }
  }
)(UnlockButtonUnconnected)

function LockedValue(props: { contractIds: string[] }) {
  let content = <div className="table-placeholder">No Contracts</div>
  if (props.contractIds.length > 0) {
    content = (
      <table className="table contracts-table">
        <thead>
          <tr>
            <th>Contract Template</th>
            <th>Amount</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {props.contractIds.map(id => (
            <LockedValueRow key={id} contractId={id} />
          ))}
        </tbody>
      </table>
    )
  }
  return <Section name="Unspent Contracts">{content}</Section>
}

const LockedValueRowUnconnected = (props: {
  contractId: string
  contract: Contract
}) => {
  const contract = props.contract
  return (
    <tr>
      <td>{contract.instantiated.template.name}</td>
      <td>{amountFromSatoshis(contract.instantiated.amount)}</td>
      <td className="td-button">
        <UnlockButton contractId={contract.id} />
      </td>
    </tr>
  )
}

const LockedValueRow = connect((state, ownProps: { contractId: string }) => {
  // mapStateToProps
  const contract = getContract(state, ownProps.contractId)
  return {
    contract
  }
})(LockedValueRowUnconnected)

const History = (props: { spentContractIds: string[] }) => {
  let content = <div className="table-placeholder">No History</div>
  if (props.spentContractIds.length > 0) {
    content = (
      <div className="table-responsive">
        <table className="table contracts-table">
          <thead>
            <tr>
              <th>Contract Template</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {props.spentContractIds.map(id => (
              <HistoryRow key={id} contractId={id} />
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  return <Section name="History">{content}</Section>
}

const HistoryRowUnconnected = (props: { string; contract: Contract }) => {
  const contract = props.contract
  return (
    <tr>
      <td>{contract.instantiated.template.name}</td>
      <td>{amountFromSatoshis(contract.instantiated.amount)}</td>
      <td />
    </tr>
  )
}

const HistoryRow = connect((state, ownProps: { contractId: string }) => {
  const contract = getContract(state, ownProps.contractId)
  return {
    contract
  }
})(HistoryRowUnconnected)
