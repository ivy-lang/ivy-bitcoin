// external imports
import React from "react";
const ErrorAlert = (props) => {
    return (React.createElement("div", { className: "panel-body inner" },
        React.createElement("h1", null, "Compiled"),
        React.createElement("div", { className: "alert alert-danger", role: "alert" },
            React.createElement("span", { className: "glyphicon glyphicon-exclamation-sign", style: { marginRight: "5px" } }),
            React.createElement("span", { className: "sr-only" }, "Error:"),
            props.errorMessage)));
};
export default ErrorAlert;
