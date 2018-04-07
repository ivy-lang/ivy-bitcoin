var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { typeToString } from "ivy-bitcoin";
import * as momentImport from "moment";
// external imports
import React from "react";
import { ButtonToolbar, DropdownButton, Form, FormControl, FormGroup, HelpBlock, InputGroup, MenuItem, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { getShowUnlockInputErrors } from "../../contracts/selectors";
import { getInputMap, getParameterIds } from "../../templates/selectors";
import RadioSelect from "../../app/components/radioselect";
import { getChild } from "../../inputs/types";
import { computeDataForInput, getParameterIdentifier, validateInput } from "../../inputs/data";
// internal imports
import { updateClauseInput, updateInput } from "../actions";
import { getClauseParameterIds, getSignatureData, getSpendInputMap } from "../selectors";
// weird workaround
const moment = typeof momentImport.default === "function"
    ? momentImport.default
    : momentImport;
function getChildWidget(input) {
    return getWidget(getChild(input));
}
function ParameterWidget(props) {
    // handle the fact that unknown input types end up here
    if (props.input.valueType === undefined) {
        throw new Error("invalid input for ParameterWidget: " + props.input.name);
    }
    // handle the fact that clause arguments look like spend.sig rather than sig
    const parameterName = getParameterIdentifier(props.input);
    const valueType = typeToString(props.input.valueType);
    return (React.createElement("div", { key: props.input.name },
        React.createElement("label", null,
            parameterName,
            ": ",
            React.createElement("span", { className: "type-label" }, valueType)),
        getChildWidget(props.input)));
}
function GenerateBytesWidget(props) {
    return (React.createElement("div", null,
        React.createElement(InputGroup, null,
            React.createElement(InputGroup.Addon, null, "Length"),
            React.createElement(FormControl, { type: "text", style: { width: 200 }, key: props.input.name, value: props.input.value, onChange: props.handleChange })),
        React.createElement(ComputedValue, { computeFor: props.id })));
}
function NumberWidget(props) {
    return (React.createElement(FormControl, { type: "text", style: { width: 250 }, key: props.input.name, value: props.input.value, onChange: props.handleChange }));
}
function ValueWidget(props) {
    return (React.createElement(InputGroup, { style: { width: "300px" } },
        React.createElement(FormControl, { type: "text", className: "string-input", placeholder: "0.0", key: props.input.name, value: props.input.value, onChange: props.handleChange }),
        React.createElement(InputGroup.Addon, null, "BTC (simulated)")));
}
function TimestampTimeWidget(props) {
    return (React.createElement("div", { className: "form-group" },
        React.createElement(FormControl, { type: "datetime-local", key: props.input.name, value: props.input.value, onChange: props.handleChange })));
}
function BooleanWidget(props) {
    // onChange is broken on ToggleButtonGroup
    // so we use a workaround
    return (React.createElement(ButtonToolbar, null,
        React.createElement(ToggleButtonGroup, { key: props.input.name, type: "radio", name: "options", value: props.input.value, onChange: e => undefined },
            React.createElement(ToggleButton, { onClick: e => {
                    props.handleChange({ target: { value: "true" } });
                }, value: "true" }, "True"),
            React.createElement(ToggleButton, { onClick: e => {
                    props.handleChange({ target: { value: "false" } });
                }, value: "false" }, "False"))));
}
function BytesWidget(props) {
    const options = [
        { label: "Generate Bytes", value: "generateBytesInput" },
        { label: "Provide Bytes", value: "provideBytesInput" }
    ];
    return (React.createElement("div", null,
        React.createElement(RadioSelect, { options: options, selected: props.input.value, name: props.input.name, handleChange: props.handleChange }),
        getChildWidget(props.input)));
}
function ProvidePrivateKeyWidget(props) {
    return (React.createElement("div", null,
        React.createElement(TextWidget, { input: props.input, handleChange: props.handleChange }),
        React.createElement(HelpBlock, null, "(Do not paste your own Bitcoin private key here)")));
}
function TextWidget(props) {
    return (React.createElement(FormControl, { type: "text", key: props.input.name, className: "form-control string-input", value: props.input.value, onChange: props.handleChange }));
}
function HashWidget(props) {
    const options = [
        { label: "Generate Hash", value: "generateHashInput" },
        { label: "Provide Hash", value: "provideHashInput" }
    ];
    const handleChange = (s) => undefined;
    return (React.createElement("div", null,
        React.createElement(RadioSelect, { options: options, selected: props.input.value, name: props.input.name, handleChange: props.handleChange }),
        getChildWidget(props.input)));
}
function GenerateHashWidget(props) {
    return (React.createElement("div", null,
        React.createElement(ComputedValue, { computeFor: props.id }),
        React.createElement("div", { className: "nested" },
            React.createElement("div", { className: "description" },
                props.input.hashType.hashFunction,
                " of:"),
            React.createElement("label", { className: "type-label" }, typeToString(props.input.hashType.inputType)),
            getChildWidget(props.input))));
}
function PublicKeyWidget(props) {
    const options = [
        { label: "Generate Public Key", value: "generatePublicKeyInput" },
        { label: "Provide Public Key", value: "providePublicKeyInput" }
    ];
    const handleChange = (s) => undefined;
    return (React.createElement("div", null,
        React.createElement(RadioSelect, { options: options, selected: props.input.value, name: props.input.name, handleChange: props.handleChange }),
        getChildWidget(props.input)));
}
function GeneratePublicKeyWidget(props) {
    const options = [
        { label: "Generate Private Key", value: "generatePrivateKeyInput" },
        { label: "Provide Private Key", value: "providePrivateKeyInput" }
    ];
    return (React.createElement("div", null,
        React.createElement(ComputedValue, { computeFor: props.id }),
        React.createElement("div", { className: "nested" },
            React.createElement("div", { className: "description" }, "derived from:"),
            React.createElement("label", { className: "type-label" }, "PrivateKey"),
            React.createElement(RadioSelect, { options: options, selected: props.input.value, name: props.input.name, handleChange: props.handleChange }),
            getChildWidget(props.input))));
}
function GenerateSignatureWidget(props) {
    return (React.createElement("div", null,
        React.createElement(ComputedValue, { computeFor: props.id }),
        React.createElement("div", { className: "nested" },
            React.createElement("div", { className: "description" }, "signed using:"),
            React.createElement("label", { className: "type-label" }, "PrivateKey"),
            getChildWidget(props.input))));
}
function SignatureWidget(props) {
    const options = [
        { label: "Generate Signature", value: "generateSignatureInput" },
        { label: "Provide Signature", value: "provideSignatureInput" }
    ];
    return (React.createElement("div", null,
        React.createElement(RadioSelect, { options: options, selected: props.input.value, name: props.input.name, handleChange: props.handleChange }),
        getChildWidget(props.input)));
}
function GeneratePrivateKeyWidget(props) {
    return (React.createElement("div", null,
        React.createElement("pre", { className: "wrap" }, props.input.value)));
}
function OptionsWidget(props) {
    const chosenOptions = props.options.filter(opt => opt.value === props.input.value);
    if (chosenOptions.length !== 1) {
        throw new Error("there should be only one chosen option");
    }
    const chosen = chosenOptions[0];
    const others = props.options.filter(opt => opt.value !== props.input.value);
    const menuItems = others.map(opt => {
        return (React.createElement(MenuItem, { key: opt.value, onClick: e => props.handleChange({ target: { value: opt.value } }) }, opt.label));
    });
    return (React.createElement("div", { style: { width: 300 } },
        React.createElement(InputGroup, null,
            getChildWidget(props.input),
            React.createElement(DropdownButton, { componentClass: InputGroup.Button, id: "input-dropdown-addon", title: chosen.label }, menuItems))));
}
function DurationWidget(props) {
    const options = [
        { label: "x 512 seconds", value: "secondsDurationInput" },
        { label: "Blocks", value: "blocksDurationInput" }
    ];
    const helperText = props.input.value === "secondsDurationInput" ? (React.createElement(ComputedSecondsWidget, { name: props.input.name + ".secondsDurationInput" })) : (React.createElement(ComputedDurationWidget, { name: props.input.name + ".blocksDurationInput" }));
    return (React.createElement(FormGroup, null,
        React.createElement(OptionsWidget, Object.assign({}, props, { options: options })),
        helperText));
}
function ComputedSecondsWidgetUnconnected(props) {
    if (!/^\d+$/.test(props.input.value)) {
        return React.createElement("span", null);
    }
    const durationsOf512Seconds = parseInt(props.input.value, 10);
    const duration = durationsOf512Seconds === 0
        ? "0 minutes"
        : moment.duration(durationsOf512Seconds * 512 * 1000).humanize();
    return React.createElement(HelpBlock, null,
        "~ ",
        duration);
}
function ComputedBlockHeightWidgetUnconnected(props) {
    if (!/^\d+$/.test(props.input.value)) {
        return React.createElement("span", null);
    }
    const blocks = parseInt(props.input.value, 10);
    const duration = blocks === 0
        ? "0 minutes"
        : moment.duration(blocks * 10 * 60 * 1000).humanize();
    return React.createElement(HelpBlock, null,
        "~ ",
        duration);
}
const mapStateToComputedInputProps = (state, { name }) => {
    const inputContext = name.split(".").shift();
    const inputMap = inputContext === "contractParameters"
        ? getInputMap(state)
        : getSpendInputMap(state);
    if (inputMap === undefined) {
        throw new Error("input map should not be undefined now");
    }
    return {
        input: inputMap[name]
    };
};
const ComputedSecondsWidget = connect(mapStateToComputedInputProps)(ComputedSecondsWidgetUnconnected);
const ComputedDurationWidget = connect(mapStateToComputedInputProps)(ComputedBlockHeightWidgetUnconnected);
function TimeWidget(props) {
    const options = [
        {
            label: "Timestamp (UTC)",
            value: "timestampTimeInput"
        },
        {
            label: "Block Height",
            value: "blockheightTimeInput"
        }
    ];
    return React.createElement(OptionsWidget, Object.assign({}, props, { options: options }));
}
function BalanceWidgetUnconnected({ namePrefix, balance }) {
    let jsx = React.createElement("small", null);
    if (balance !== undefined) {
        jsx = React.createElement("small", { className: "value-balance" },
            balance,
            " available");
    }
    return jsx;
}
function LockTimeWidget(props) {
    return getChildWidget(props.input);
}
function SequenceNumberWidget(props) {
    return getChildWidget(props.input);
}
function getWidgetType(type) {
    switch (type) {
        case "numberInput":
            return NumberWidget;
        case "booleanInput":
            return BooleanWidget;
        case "bytesInput":
            return BytesWidget;
        case "generateBytesInput":
            return GenerateBytesWidget;
        case "provideBytesInput":
            return TextWidget;
        case "publicKeyInput":
            return PublicKeyWidget;
        case "signatureInput":
            return SignatureWidget;
        case "generateSignatureInput":
            return GenerateSignatureWidget;
        case "generatePublicKeyInput":
            return GeneratePublicKeyWidget;
        case "generatePrivateKeyInput":
            return GeneratePrivateKeyWidget;
        case "providePublicKeyInput":
            return TextWidget;
        case "providePrivateKeyInput":
            return ProvidePrivateKeyWidget;
        case "provideSignatureInput":
            return TextWidget;
        case "hashInput":
            return HashWidget;
        case "provideHashInput":
            return TextWidget;
        case "generateHashInput":
            return GenerateHashWidget;
        case "timeInput":
            return TimeWidget;
        case "valueInput":
            return ValueWidget;
        case "timestampTimeInput":
            return TimestampTimeWidget;
        case "blockheightTimeInput":
            return NumberWidget;
        case "durationInput":
            return DurationWidget;
        case "secondsDurationInput":
            return TextWidget;
        case "blocksDurationInput":
            return TextWidget;
        case "lockTimeInput":
            return LockTimeWidget;
        case "sequenceNumberInput":
            return SequenceNumberWidget;
        default:
            return ParameterWidget;
    }
}
function mapToInputProps(pageShowError, inputsById, id) {
    const input = inputsById[id];
    if (input === undefined) {
        throw new Error("bad input ID: " + id);
    }
    const hasInputError = !validateInput(input);
    return {
        input,
        hasInputError,
        pageShowError
    };
}
function mapStateToContractInputProps(state, ownProps) {
    const inputMap = getInputMap(state);
    if (inputMap === undefined) {
        throw new Error("inputMap should not be undefined when contract inputs are being rendered");
    }
    // const showError = getShowLockInputErrors(state)
    return mapToInputProps(ownProps.showError, inputMap, ownProps.id);
}
function mapDispatchToContractInputProps(dispatch, ownProps) {
    return {
        handleChange: e => {
            dispatch(updateInput(ownProps.id, e.target.value.toString()));
        }
    };
}
function mapStateToSpendInputProps(state, ownProps) {
    const inputsById = getSpendInputMap(state);
    const showError = getShowUnlockInputErrors(state);
    return mapToInputProps(showError, inputsById, ownProps.id);
}
function mapDispatchToSpendInputProps(dispatch, ownProps) {
    return {
        handleChange: e => {
            dispatch(updateClauseInput(ownProps.id, e.target.value.toString()));
        }
    };
}
function mapToComputedProps(state, ownProps) {
    const id = ownProps.computeFor;
    const inputContext = id.split(".").shift();
    const inputsById = inputContext === "contractParameters"
        ? getInputMap(state)
        : getSpendInputMap(state);
    if (inputsById === undefined) {
        throw new Error("inputMap should not be undefined when contract inputs are being rendered");
    }
    const input = inputsById[id];
    if (input === undefined) {
        throw new Error("bad input ID: " + ownProps.computeFor);
    }
    if (input.type === "generateHashInput" ||
        input.type === "generateBytesInput" ||
        input.type === "generatePublicKeyInput") {
        try {
            const computedValue = computeDataForInput(ownProps.computeFor, inputsById);
            return {
                value: computedValue
            };
        }
        catch (e) {
            console.log(e);
            return {};
        }
    }
    else if (input.type === "generateSignatureInput") {
        try {
            const computedValue = getSignatureData(state, id, inputsById);
            return {
                value: computedValue
            };
        }
        catch (e) {
            console.log(e);
            return {};
        }
    }
}
function ComputedValueUnconnected(props) {
    return props.value ? React.createElement("pre", null, props.value) : React.createElement("span", null);
}
const ComputedValue = connect(mapToComputedProps)(ComputedValueUnconnected);
// higher order component
function addID(id) {
    return (WrappedWidget) => {
        return React.createElement(WrappedWidget, {
            key: "connect(" + id + ")",
            id
        });
    };
}
// higher order component
function focusWidget(WrappedWidget) {
    return class FocusWidget extends React.Component {
        constructor(props) {
            super(props);
            this.state = { showError: false };
        }
        componentWillReceiveProps(nextProps) {
            this.setState({ showError: true });
        }
        render() {
            const _a = this.props, { handleChange, hasInputError } = _a, passProps = __rest(_a, ["handleChange", "hasInputError"]);
            const errorClass = hasInputError
                ? this.state.showError ? "has-error" : "has-warning"
                : "";
            return (React.createElement("div", { className: "form-group " + errorClass },
                React.createElement(WrappedWidget, Object.assign({ errorClass: errorClass, handleChange: handleChange }, passProps))));
        }
    };
}
export function getWidget(id) {
    const inputContext = id.split(".").shift();
    const type = id.split(".").pop();
    let widgetTypeConnected;
    if (inputContext === "contractParameters") {
        widgetTypeConnected = connect(mapStateToContractInputProps, mapDispatchToContractInputProps)(focusWidget(getWidgetType(type)));
    }
    else {
        widgetTypeConnected = connect(mapStateToSpendInputProps, mapDispatchToSpendInputProps)(focusWidget(getWidgetType(type)));
    }
    const widget = addID(id)(widgetTypeConnected);
    return (React.createElement("div", { className: "widget-wrapper", key: "container(" + id + ")" }, widget));
}
function mapStateToContractParametersProps(state) {
    return {
        parameterIds: getParameterIds(state)
    };
}
function ContractParametersUnconnected(props) {
    if (props.parameterIds.length === 0) {
        return React.createElement("div", null);
    }
    const parameterInputs = props.parameterIds.map(id => {
        return (React.createElement("div", { key: id, className: "argument" }, getWidget(id)));
    });
    return (React.createElement("section", { style: { wordBreak: "break-all" } },
        React.createElement(Form, null, parameterInputs)));
}
export const ContractParameters = connect(mapStateToContractParametersProps)(ContractParametersUnconnected);
function ClauseParametersUnconnected(props) {
    if (props.parameterIds.length === 0) {
        return React.createElement("div", null);
    }
    const parameterInputs = props.parameterIds.map(id => {
        return (React.createElement("div", { key: id, className: "argument" }, getWidget(id)));
    });
    return (React.createElement("section", null,
        React.createElement("h4", null, "Clause Arguments"),
        React.createElement(Form, null, parameterInputs)));
}
export const ClauseParameters = connect(state => ({
    parameterIds: getClauseParameterIds(state)
}))(ClauseParametersUnconnected);
