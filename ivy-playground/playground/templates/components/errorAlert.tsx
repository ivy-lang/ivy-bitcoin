// external imports
import React from "react"

const ErrorAlert = (props: { errorMessage }) => {
  return (
    <div className="panel-body inner">
      <h1>Compiled</h1>
      <div className="alert alert-danger" role="alert">
        <span
          className="glyphicon glyphicon-exclamation-sign"
          style={{ marginRight: "5px" }}
        />
        <span className="sr-only">Error:</span>
        {props.errorMessage}
      </div>
    </div>
  )
}

export default ErrorAlert
