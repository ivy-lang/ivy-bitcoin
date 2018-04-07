import React from "react";
export default function Display(props) {
    return React.createElement("pre", null, props.source);
}
