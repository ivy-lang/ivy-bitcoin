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

function shortenHash(hash: string) {
  if (hash.length < 9) {
    return hash
  } else {
    return hash.slice(0, 25) + "..."
  }
}

const LockedValueDisplay = (props: {
  contractIds: string[]
  spentContractIds: string[]
}) => {
  return (
    <DocumentTitle title="Unlock Value">
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

const UnlockButton = (props: { contractId: string }) => {
  return (
    <Link to={"/unlock/" + props.contractId}>
      <button className="btn btn-primary">Unlock</button>
    </Link>
  )
}

function LockedValue(props: { contractIds: string[] }) {
  let content = <div className="table-placeholder">No Locked Value</div>
  if (props.contractIds.length > 0) {
    content = (
      <table className="table contracts-table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Contract Template</th>
            <th>Lock Transaction</th>
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
  return <Section name="Locked Value">{content}</Section>
}

const LockedValueRowUnconnected = (props: {
  contractId: string
  contract: Contract
}) => {
  const contract = props.contract
  return (
    <tr>
      <td>{contract.amount}</td>
      <td>{contract.template.name}</td>
      <td>{shortenHash(contract.id)}</td>
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
              <th>Amount</th>
              <th>Contract Template</th>
              <th>Lock Transaction</th>
              <th>Unlock Transaction</th>
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
      <td>{contract.amount}</td>
      <td>{contract.template.name}</td>
      <td>{shortenHash(contract.id)}</td>
      <td>{shortenHash(contract.unlockTxid)}</td>
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
