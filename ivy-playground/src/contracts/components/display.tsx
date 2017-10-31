import React from "react"
import { connect } from "react-redux"
import { getSpendContract } from "../selectors"

export const Display = (props: { displayed: string }) => {
  return <pre className="codeblock">{props.displayed}</pre>
}

export const DisplaySpendContract = connect(state => {
  const contract = getSpendContract(state)
  if (contract) {
    return { displayed: contract.template.source }
  }
  return { displayed: "" }
})(Display)

export const DisplayInstructions = connect(state => {
  const contract = getSpendContract(state)
  if (contract) {
    return { displayed: contract.template.instructions.join(" ") }
  }
  return { displayed: "" }
})(Display)
