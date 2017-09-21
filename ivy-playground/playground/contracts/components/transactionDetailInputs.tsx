import React from "react"
import { Panel } from "react-bootstrap"
import { connect } from "react-redux"
import { HelpIcon, HelpMessage } from "../../templates/components/helpicon"
import { getWidget } from "./parameters"

export function LockTimeControl(props: {}) {
  return (
    <div className="argument">
      <label>Minimum Time</label> <HelpIcon identifier="time" />
      <HelpMessage
        identifier="time"
        message={
          "The earliest time at which this transaction can be posted to the blockchain. " +
          "Corresponds to the transaction's nLockTime. You need to set this if the clause" +
          " you are triggering uses 'after'."
        }
      />
      {getWidget("transactionDetails.lockTimeInput")}
    </div>
  )
}

export function SequenceNumberControl(props: {}) {
  return (
    <div className="argument">
      <label>Minimum Age</label> <HelpIcon identifier="age" />
      <HelpMessage
        identifier="age"
        message={
          "The minimum age the contract must reach before this spending transaction is valid." +
          " Corresponds to the input's sequence number. You need to set this if the clause you" +
          " are triggering uses 'older'."
        }
      />
      {getWidget("transactionDetails.sequenceNumberInput")}
    </div>
  )
}

export const TransactionDetails = connect()(() => {
  // need to do this for the refresh to work properly
  return (
    <Panel header={<h4>Transaction Details</h4>}>
      <LockTimeControl />
      <SequenceNumberControl />
    </Panel>
  )
})
