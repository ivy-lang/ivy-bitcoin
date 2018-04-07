// external imports
import React from "react";
import { connect } from "react-redux";
// ivy imports
import Section from "../../app/components/section";
import { ContractParameters } from "../../contracts/components/parameters";
import { Bytecode } from "./opcodes";
// internal imports
import { getContractParameters, getError, getInstantiated, getSource } from "../selectors";
import Editor from "./editor";
import LockButton from "./lockButton";
const mapStateToProps = state => {
    const source = getSource(state);
    const contractParameters = getContractParameters(state);
    const error = getError(state);
    const bytecode = getInstantiated(state);
    return { source, contractParameters, error, bytecode };
};
const ErrorAlert = (props) => {
    return (React.createElement("div", { style: { margin: "25px 0 0 0" }, className: "alert alert-danger", role: "alert" },
        React.createElement("span", { className: "sr-only" }, "Error:"),
        React.createElement("span", { className: "glyphicon glyphicon-exclamation-sign", style: { marginRight: "5px" } }),
        props.error));
};
const Lock = ({ source, contractParameters, error, bytecode }) => {
    let instantiate;
    if (contractParameters !== undefined) {
        instantiate = (React.createElement("div", null,
            contractParameters.length > 0 ? (React.createElement(Section, { name: "Contract Arguments" },
                React.createElement("div", { className: "form-wrapper" },
                    React.createElement(ContractParameters, null)),
                React.createElement("div", { className: "form-wrapper" }, error ? React.createElement(ErrorAlert, { error: error }) : React.createElement("div", null)))) : (React.createElement("div", null)),
            bytecode ? (React.createElement(Section, { name: "Address" }, error ? React.createElement("div", null) : React.createElement(Bytecode, null))) : (React.createElement("div", null)),
            React.createElement(LockButton, null)));
    }
    else {
        instantiate = React.createElement("div", null);
    }
    return (React.createElement("div", null,
        React.createElement(Editor, null),
        instantiate));
};
export default connect(mapStateToProps)(Lock);
