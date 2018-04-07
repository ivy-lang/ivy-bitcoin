// external imports
import React from "react";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
// ivy imports
import { create } from "../../contracts/actions";
// internal imports
import { Col, Grid, Row } from "react-bootstrap";
import { getCreateability } from "../selectors";
const LockButton = (props) => {
    const button = (React.createElement("button", { className: "btn btn-primary btn-lg form-button", disabled: !props.createability.createable, onClick: props.create }, "Create"));
    if (props.createability.createable) {
        return (React.createElement(Grid, null,
            React.createElement(Row, null,
                React.createElement(Col, null, button))));
    }
    else {
        return (React.createElement(Grid, null,
            React.createElement(Row, null,
                React.createElement(Col, null,
                    React.createElement("div", { "data-for": "lockButtonTooltip", "data-tip": props.createability.error, style: { width: 119, height: 45 } }, button),
                    React.createElement(ReactTooltip, { id: "lockButtonTooltip", place: "right", type: "error", effect: "solid" }, props.createability.error)))));
    }
};
export default connect(state => ({ createability: getCreateability(state) }), {
    create
})(LockButton);
