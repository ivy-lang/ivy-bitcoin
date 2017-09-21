// external imports
import React from "react"
import { connect } from "react-redux"

// ivy imports
import { getWidget } from "../../contracts/components/parameters"
import { Input } from "../../inputs/types"

// internal imports
import { getSpendContract } from "../selectors"

const UnlockDestination = (props: { contract; unlockInput: Input }) => {
  return <div />
}

export default connect(
  state => ({}) // ({ unlockInput: getClauseUnlockInput(state), contract: getSpendContract(state) })
)(UnlockDestination)
