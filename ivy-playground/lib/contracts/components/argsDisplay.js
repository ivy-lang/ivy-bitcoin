// external imports
import { typeToString } from "ivy-bitcoin";
import React from "react";
import { connect } from "react-redux";
import { computeDataForInput, getGenerateBytesInputValue, getParameterIdentifier } from "../../inputs/data";
import { getChild } from "../../inputs/types";
import { getInputMap, getInputSelector, getParameterIds, getSpendContractJson } from "../selectors";
function getChildWidget(input) {
    return getWidget(getChild(input));
}
function ParameterWidget(props) {
    // handle the fact that unknown input types end up here
    if (props.input.valueType === undefined) {
        throw new Error("invalid input for ParameterWidget: " + props.input.name);
    }
    return (React.createElement("div", { key: props.input.name },
        React.createElement("label", null,
            getParameterIdentifier(props.input),
            ":",
            React.createElement("span", { className: "type-label" }, typeToString(props.input.valueType))),
        React.createElement("div", null, getChildWidget(props.input))));
}
function GeneratePublicKeyWidget(props) {
    return (React.createElement("div", null,
        React.createElement("pre", null, props.computedValue),
        React.createElement("div", { className: "nested" },
            React.createElement("div", { className: "description" }, "derived from:"),
            React.createElement("label", { className: "type-label" }, "PrivateKey"),
            getChildWidget(props.input))));
}
// function ValueWidget(props: { input: ValueInput }) {
//   return <div>
//     {getWidget(props.input.name + ".amountInput")}
//   </div>
// }
// function AmountWidget(props: { input: Input }) {
// return <div className="form-group">
//   <div className="input-group">
//     <div className="input-group-addon">Amount</div>
//     <input type="text" className="form-control" value={props.input.value} disabled />
//   </div>
// </div>
// }
function TextWidget(props) {
    return (React.createElement("div", null,
        React.createElement("pre", null, props.input.value)));
}
function GenerateHashWidget(props) {
    return (React.createElement("div", null,
        React.createElement("pre", null, props.computedValue),
        React.createElement("div", { className: "nested" },
            React.createElement("div", { className: "description" },
                props.input.hashType.hashFunction,
                " of:"),
            React.createElement("label", { className: "type-label" }, typeToString(props.input.hashType.inputType)),
            getChildWidget(props.input))));
}
function ParentWidget(props) {
    return getChildWidget(props.input);
}
function BlocksDurationWidget(props) {
    return React.createElement("pre", null, props.input.value);
}
function SecondsDurationWidget(props) {
    const numIncrements = parseInt(props.input.value, 10);
    return React.createElement("div", null,
        numIncrements * 512,
        " seconds");
}
function BlockheightTimeWidget(props) {
    return React.createElement("pre", null, props.input.value);
}
function TimestampTimeWidget(props) {
    return React.createElement("pre", null, props.input.value); // super lazy for now!
}
function GenerateBytesWidget(props) {
    return (React.createElement("div", null,
        React.createElement("pre", null, getGenerateBytesInputValue(props.input))));
}
function ValueWidget(props) {
    return (React.createElement("div", null,
        React.createElement("pre", null,
            props.input.value,
            " BTC")));
}
function getWidgetType(type) {
    switch (type) {
        case "publicKeyInput":
        case "bytesInput":
        case "hashInput":
        case "durationInput":
        case "timeInput":
            return ParentWidget;
        case "generatePublicKeyInput":
            return GeneratePublicKeyWidget;
        case "generateHashInput":
            return GenerateHashWidget;
        case "blocksDurationInput":
            return BlocksDurationWidget;
        case "secondsDurationInput":
            return SecondsDurationWidget;
        case "timestampTimeInput":
            return TimestampTimeWidget;
        case "blockheightTimeInput":
            return BlockheightTimeWidget;
        case "generateBytesInput":
            return GenerateBytesWidget;
        case "valueInput":
            return ValueWidget;
        case "numberInput":
        case "booleanInput":
        case "provideBytesInput":
        case "providePublicKeyInput":
        case "provideHashInput":
        case "generatePrivateKeyInput":
        case "providePrivateKeyInput":
            return TextWidget;
        default:
            return ParameterWidget;
    }
}
function getWidget(id) {
    const type = id.split(".").pop();
    let widgetTypeConnected = connect(state => ({
        input: getInputSelector(id)(state)
    }))(getWidgetType(type));
    if (type === "generateHashInput" || type === "generatePublicKeyInput") {
        widgetTypeConnected = connect(state => {
            return {
                input: getInputSelector(id)(state),
                computedValue: computeDataForInput(id, getInputMap(state))
            };
        })(getWidgetType(type));
    }
    return React.createElement(widgetTypeConnected, {
        key: "connect(" + id + ")",
        id
    });
}
function SpendInputsUnconnected(props) {
    if (props.spendInputIds.length === 0) {
        return React.createElement("div", null);
    }
    const spendInputWidgets = props.spendInputIds.map(id => {
        return (React.createElement("div", { key: id, className: "argument" }, getWidget(id)));
    });
    return (React.createElement("section", { style: { wordBreak: "break-all" } },
        React.createElement("h4", null, "Contract Arguments"),
        React.createElement("form", { className: "form" }, spendInputWidgets)));
}
const SpendInputs = connect(state => ({
    spendInputIds: getParameterIds(state),
    contractJson: getSpendContractJson(state)
}))(SpendInputsUnconnected);
export default SpendInputs;
