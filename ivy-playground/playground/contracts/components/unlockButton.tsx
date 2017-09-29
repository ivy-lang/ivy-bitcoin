import React from "react"
import { connect } from "react-redux"
import { spend } from "../actions"
import { getResult } from "../selectors"

const mapDispatchToProps = dispatch => ({
  handleSpendClick() {
    dispatch(spend())
  }
})

const UnlockButton = (props: {
  enabled: boolean
  handleSpendClick: (e) => undefined
}) => {
  return (
    <button
      className="btn btn-primary btn-lg form-button"
      disabled={!props.enabled}
      onClick={props.handleSpendClick}
    >
      Unlock
    </button>
  )
}

export default connect(
  state => ({ enabled: getResult(state).success }),
  mapDispatchToProps
)(UnlockButton)
