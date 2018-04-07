import React from "react";
import { Panel } from "react-bootstrap";
import { connect } from "react-redux";
import { HelpIcon, HelpMessage } from "../../templates/components/helpicon";
import { getWidget } from "./parameters";
export function LockTimeControl(props) {
    return (React.createElement("div", { className: "argument" },
        React.createElement("label", null, "Minimum Time"),
        " ",
        React.createElement(HelpIcon, { identifier: "time" }),
        React.createElement(HelpMessage, { identifier: "time", message: "The earliest time at which this transaction can be posted to the blockchain. " +
                "Corresponds to the transaction's nLockTime. You need to set this if the clause" +
                " you are triggering uses 'after'." }),
        getWidget("transactionDetails.lockTimeInput")));
}
export function SequenceNumberControl(props) {
    return (React.createElement("div", { className: "argument" },
        React.createElement("label", null, "Minimum Age"),
        " ",
        React.createElement(HelpIcon, { identifier: "age" }),
        React.createElement(HelpMessage, { identifier: "age", message: "The minimum age the contract must reach before this spending transaction is valid." +
                " Corresponds to the input's sequence number. You need to set this if the clause you" +
                " are triggering uses 'older'." }),
        getWidget("transactionDetails.sequenceNumberInput")));
}
export const TransactionDetails = connect()(() => {
    // need to do this for the refresh to work properly
    return (React.createElement(Panel, { header: React.createElement("h4", null, "Transaction Details") },
        React.createElement(LockTimeControl, null),
        React.createElement(SequenceNumberControl, null)));
});
