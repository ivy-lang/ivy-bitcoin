import React from "react";
import { connect } from "react-redux";
import { spend } from "../actions";
import { getResult } from "../selectors";
const mapDispatchToProps = dispatch => ({
    handleSpendClick() {
        dispatch(spend());
    }
});
const UnlockButton = (props) => {
    return (React.createElement("button", { className: "btn btn-primary btn-lg form-button", disabled: !props.enabled, onClick: props.handleSpendClick }, "Unlock"));
};
export default connect(state => ({ enabled: getResult(state).success }), mapDispatchToProps)(UnlockButton);
