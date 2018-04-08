// external imports
import React from "react";
import { Alert, Col, Glyphicon, Grid, Row } from "react-bootstrap";
import DocumentTitle from "react-document-title";
import { connect } from "react-redux";
// ivy imports
import Section from "../../app/components/section";
import { getContractMap, getError, getResult, getSpendContractId } from "../../contracts/selectors";
// internal imports
import SpendInputs from "./argsDisplay";
import ClauseSelect from "./clauseselect";
import { DisplayInstructions, DisplaySpendContract } from "./display";
import { ClauseParameters } from "./parameters";
import UnlockButton from "./unlockButton";
import { TransactionDetails } from "./transactionDetailInputs";
// import ivy-plugin css
import '../../static/bootstrap.css';
import '../../static/ivy-plugin.css';
const mapStateToProps = state => {
    const error = getError(state);
    const map = getContractMap(state);
    const id = getSpendContractId(state);
    const result = map[id] && getResult(state);
    const display = map[id] !== undefined;
    return { error, display, result };
};
const ErrorAlert = (props) => {
    return (React.createElement("div", { style: { margin: "25px 0 0 0" }, className: "alert alert-danger", role: "alert" },
        React.createElement("span", { className: "sr-only" }, "Error:"),
        React.createElement("span", { className: "glyphicon glyphicon-exclamation-sign", style: { marginRight: "5px" } }),
        props.error));
};
const ErrorMessage = (props) => {
    return (React.createElement(Alert, { bsStyle: props.result.style },
        React.createElement(Glyphicon, { glyph: "exclamation-sign" }),
        " ",
        props.result.message));
};
export const Unlock = ({ error, display, result }) => {
    let summary = React.createElement("div", { className: "table-placeholder" }, "No Contract Found");
    let details = React.createElement("div", null);
    let button;
    if (display) {
        summary = (React.createElement("div", { className: "form-wrapper with-subsections" },
            React.createElement("section", null,
                React.createElement("h4", null, "Contract Template"),
                React.createElement(DisplaySpendContract, null)),
            React.createElement("section", null,
                React.createElement("h4", null, "Bitcoin Script"),
                React.createElement(DisplayInstructions, null)),
            React.createElement(SpendInputs, null)));
        details = (React.createElement(Section, { name: "Unlock" },
            React.createElement("div", { className: "form-wrapper with-subsections" },
                React.createElement(ClauseSelect, null),
                React.createElement(ClauseParameters, null),
                error ? React.createElement(ErrorAlert, { error: error }) : React.createElement("div", null))));
        button = (React.createElement(Grid, null,
            React.createElement(Row, null,
                React.createElement(Col, { sm: 10 }, !result.success ? React.createElement(ErrorMessage, { result: result }) : React.createElement("div", null))),
            React.createElement(Row, null,
                React.createElement(Col, { sm: 2 },
                    React.createElement(UnlockButton, null)))));
    }
    return (React.createElement(DocumentTitle, { title: "Unlock Contract" },
        React.createElement("div", { className: "ivy-plugin" },
            React.createElement(Section, { name: "Contract Summary" }, summary),
            details,
            display && React.createElement(TransactionDetails, null),
            button)));
};
export default connect(mapStateToProps)(Unlock);
