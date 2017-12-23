import React from "react"
import { connect } from "react-redux"
import {
  getSpendContractInstructions,
  getSpendContractSource
} from "../selectors"

export const Display = (props: { displayed: string }) => {
  return <pre className="wrap">{props.displayed}</pre>
}

export const DisplaySpendContract = connect(state => {
  const source = getSpendContractSource(state)
  if (source) {
    return { displayed: source }
  }
  return { displayed: "" }
})(Display)

export const DisplayInstructions = connect(state => {
  const displayed = getSpendContractInstructions(state)
  return { displayed }
})(Display)
