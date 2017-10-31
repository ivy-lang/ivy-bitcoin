// external imports
import React from "react"
import { connect } from "react-redux"
import ReactTooltip from "react-tooltip"

// internal imports
import { getCompiled, getError, getSource } from "../selectors"
import Ace from "./ace"
import ErrorAlert from "./errorAlert"
import LoadTemplate from "./loadTemplate"
import { Opcodes } from "./opcodes"
import SaveTemplate from "./saveTemplate"

// Handles syntax highlighting
require("../util/ivymode.js")

const mapStateToProps = state => {
  return {
    source: getSource(state),
    error: getError(state)
  }
}

const Editor = ({ source, error }) => {
  return (
    <div>
      <ReactTooltip
        id="saveButtonTooltip"
        place="bottom"
        type="error"
        effect="solid"
      />
      <div className="panel panel-default">
        <div className="panel-heading clearfix">
          <h1 className="panel-title pull-left">Contract Template</h1>
          <ul className="panel-heading-btns pull-right">
            <li>
              <LoadTemplate />
            </li>
            <li>
              <SaveTemplate />
            </li>
          </ul>
        </div>
        <Ace source={source} />
        {error ? <ErrorAlert errorMessage={error} /> : <Opcodes />}
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Editor)
