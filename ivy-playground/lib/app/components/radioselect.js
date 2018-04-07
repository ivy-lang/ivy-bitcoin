import React from "react";
export default function RadioSelect(props) {
    return (React.createElement("div", { className: "radio" }, props.options.map(option => {
        const checked = props.selected === option.value;
        return (React.createElement("label", { className: "radio-inline", key: option.value },
            React.createElement("input", { type: "radio", name: name, value: option.value, checked: checked, onChange: props.handleChange }),
            option.label));
    })));
}
