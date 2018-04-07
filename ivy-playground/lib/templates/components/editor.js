// external imports
import React from "react";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
// internal imports
import { getError, getSource } from "../selectors";
import Ace from "./ace";
import ErrorAlert from "./errorAlert";
import LoadTemplate from "./loadTemplate";
import { Opcodes } from "./opcodes";
import SaveTemplate from "./saveTemplate";
// Handles syntax highlighting
require("../util/ivymode.js");
const mapStateToProps = state => {
    return {
        source: getSource(state),
        error: getError(state)
    };
};
const Editor = ({ source, error }) => {
    return (React.createElement("div", null,
        React.createElement(ReactTooltip, { id: "saveButtonTooltip", place: "bottom", type: "error", effect: "solid" }),
        React.createElement("div", { className: "panel panel-default" },
            React.createElement("div", { className: "panel-heading clearfix" },
                React.createElement("h1", { className: "panel-title pull-left" }, "Contract Template"),
                React.createElement("ul", { className: "panel-heading-btns pull-right" },
                    React.createElement("li", null,
                        React.createElement(LoadTemplate, null)),
                    React.createElement("li", null,
                        React.createElement(SaveTemplate, null)))),
            React.createElement(Ace, { source: source }),
            error ? React.createElement(ErrorAlert, { errorMessage: error }) : React.createElement(Opcodes, null))));
};
export default connect(mapStateToProps)(Editor);
