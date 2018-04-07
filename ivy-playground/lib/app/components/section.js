import React from "react";
export default function Section(props) {
    return (React.createElement("div", { className: "panel panel-default" },
        React.createElement("div", { className: "panel-heading" },
            React.createElement("h1", { className: "panel-title" }, props.name)),
        React.createElement("div", { className: "panel-body" }, props.children),
        props.footer ? (React.createElement("div", { className: "panel-footer" }, props.footer)) : (React.createElement("div", null))));
}
