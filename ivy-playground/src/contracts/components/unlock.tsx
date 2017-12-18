// external imports
import React from "react"
import { Alert, Col, Glyphicon, Grid, Row } from "react-bootstrap"
import DocumentTitle from "react-document-title"
import { connect } from "react-redux"
import {} from "../../templates/components/helpicon"

// ivy imports
import Section from "../../app/components/section"
import {
  getContractMap,
  getError,
  getResult,
  getSpendContractId
} from "../../contracts/selectors"
import { Contract } from "../types"

// internal imports
import SpendInputs from "./argsDisplay"
import ClauseSelect from "./clauseselect"
import { DisplayInstructions, DisplaySpendContract } from "./display"
import { ClauseParameters, getWidget } from "./parameters"
import UnlockButton from "./unlockButton"

import { TransactionDetails } from "./transactionDetailInputs"

const mapStateToProps = state => {
  const error = getError(state)
  const map = getContractMap(state)
  const id = getSpendContractId(state)
  const result = map[id] && getResult(state)
  const display = map[id] !== undefined
  return { error, display, result }
}

const ErrorAlert = (props: { error: string }) => {
  return (
    <div
      style={{ margin: "25px 0 0 0" }}
      className="alert alert-danger"
      role="alert"
    >
      <span className="sr-only">Error:</span>
      <span
        className="glyphicon glyphicon-exclamation-sign"
        style={{ marginRight: "5px" }}
      />
      {props.error}
    </div>
  )
}

const ErrorMessage = (props: {
  result: { message: string; style: string }
}) => {
  return (
    <Alert bsStyle={props.result.style}>
      <Glyphicon glyph="exclamation-sign" /> {props.result.message}
    </Alert>
  )
}

export const Unlock = ({ error, display, result }) => {
  let summary = <div className="table-placeholder">No Contract Found</div>
  let details = <div />
  let button

  if (display) {
    summary = (
      <div className="form-wrapper with-subsections">
        <section>
          <h4>Contract Template</h4>
          <DisplaySpendContract />
        </section>
        <section>
          <h4>Bitcoin Script</h4>
          <DisplayInstructions />
        </section>
        <SpendInputs />
      </div>
    )

    details = (
      <Section name="Unlock">
        <div className="form-wrapper with-subsections">
          <ClauseSelect />
          <ClauseParameters />
          {error ? <ErrorAlert error={error} /> : <div />}
        </div>
      </Section>
    )

    button = (
      <Grid>
        <Row>
          <Col sm={10}>
            {!result.success ? <ErrorMessage result={result} /> : <div />}
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <UnlockButton />
          </Col>
        </Row>
      </Grid>
    )
  }
  return (
    <DocumentTitle title="Unlock Contract">
      <div>
        <Section name="Contract Summary">{summary}</Section>
        {details}
        {display && <TransactionDetails />}
        {button}
      </div>
    </DocumentTitle>
  )
}

export default connect(mapStateToProps)(Unlock)
