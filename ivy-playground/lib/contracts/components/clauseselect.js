// external imports
import React from "react";
import { connect } from "react-redux";
import { setClauseIndex } from "../actions";
import { getSelectedClauseIndex, getSpendContractClauses, getSpendContractId } from "../selectors";
const ClauseSelect = (props) => {
    return (React.createElement("section", null,
        React.createElement("h4", null, "Clause"),
        React.createElement("select", { className: "form-control", value: props.spendIndex, onChange: e => props.setClauseIndex(parseInt(e.target.value, 10)) }, props.clauses.map((clause, i) => (React.createElement("option", { key: clause.name, value: i }, clause.name))))));
};
export default connect(state => ({
    spendIndex: getSelectedClauseIndex(state),
    clauses: getSpendContractClauses(state),
    contractId: getSpendContractId(state)
}), { setClauseIndex })(ClauseSelect);
