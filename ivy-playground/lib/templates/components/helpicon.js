import React from "react";
import ReactTooltip from "react-tooltip";
export const HelpIcon = (props) => {
    const iconId = props.identifier + "-question-mark";
    return (React.createElement("a", { "data-tip": true, "data-for": iconId },
        React.createElement("small", null,
            React.createElement("span", { className: "glyphicon glyphicon-question-sign", "aria-hidden": "true" }))));
};
export const HelpMessage = (props) => {
    const iconId = props.identifier + "-question-mark";
    return (React.createElement(ReactTooltip, { id: iconId, place: "right", effect: "solid" },
        React.createElement("span", null, props.message)));
};
