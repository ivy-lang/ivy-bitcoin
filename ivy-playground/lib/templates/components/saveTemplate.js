import React from "react";
// external imports
import { connect } from "react-redux";
// internal imports
import { saveTemplate } from "../actions";
import { getSaveability } from "../selectors";
const mapStateToProps = state => {
    const saveability = getSaveability(state);
    return {
        saveability
    };
};
const mapDispatchToProps = dispatch => {
    return {
        handleClick() {
            dispatch(saveTemplate());
        }
    };
};
const SaveTemplate = ({ handleClick, saveability }) => {
    if (saveability.saveable) {
        return (React.createElement("button", { className: "btn btn-primary", onClick: handleClick },
            React.createElement("span", { className: "glyphicon glyphicon-floppy-disk" }),
            "Save"));
    }
    else {
        return (React.createElement("div", { "data-for": "saveButtonTooltip", "data-tip": saveability.error },
            React.createElement("button", { className: "btn btn-primary", disabled: true },
                React.createElement("span", { className: "glyphicon glyphicon-floppy-disk" }),
                "Save")));
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(SaveTemplate);
