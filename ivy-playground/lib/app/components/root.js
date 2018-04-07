import React from "react";
import NavBar from "./navbar";
export default function Root(props) {
    return (React.createElement("div", null,
        React.createElement(NavBar, null),
        React.createElement("div", { className: "container fixedcontainer" }, props.children),
        React.createElement("footer", { className: "page-footer" },
            React.createElement("div", { className: "container fixedcontainer" },
                React.createElement("hr", null),
                "\u00A9 2017 Chain Inc. Built using ",
                React.createElement("a", { href: "http://bcoin.io" }, "bcoin"),
                "."))));
}
