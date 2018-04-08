import React from "react";
import { connect } from "react-redux";
import { getInstantiated, getOpcodes } from "../selectors";
import { HelpIcon, HelpMessage } from "./helpicon";
const mapStateToOpcodesProps = state => {
    const opcodes = getOpcodes(state) || [];
    // if (opcodes === undefined) throw "uncaught compiler error"
    return { opcodes };
};
const mapStateToBytecodeProps = state => {
    const instantiated = getInstantiated(state);
    const network = state.node.node.network;
    return { instantiated, network };
};
const OpcodesUnconnected = ({ opcodes }) => {
    return (React.createElement("div", { className: "panel-body inner" },
        React.createElement("h1", null, "Bitcoin Script"),
        React.createElement("pre", { className: "wrap" }, opcodes.join(" "))));
};
const BytecodeUnconnected = ({ instantiated: { publicKey, witnessScript, redeemScript, testnetAddress, mainnetAddress, simnetAddress }, network }) => {
    const address = network === "simnet"
        ? simnetAddress
        : network === "testnet" ? testnetAddress : mainnetAddress;
    const witnessScriptMessage = "The compiled script (in hex), which will \
later be revealed in the witness of the spending transaction and evaluated \
against some arguments to validate the transaction.";
    const publicKeyMessage = "The public key (in hex), which will later be revealed \
  in the witness of the spending transaction, along with a signature.";
    const redeemMessage = "A script (in hex) that commits to the " +
        (publicKey ? "public key" : "witness script") +
        " and which will later be used in the scriptSig of the spending transaction.";
    const addressMessage = "The address (in Base58) that you would use to fund this contract. \
 It appears in one of the outputs of the funding transactions.";
    return (React.createElement("div", { className: "panel-body inner" },
        "This is a",
        " ",
        publicKey ? "Pay-To-Witness-Public-Key" : "Pay-To-Witness-Script-Hash",
        " ",
        "address. For more information on how SegWit addresses work, see",
        " ",
        React.createElement("a", { href: "https://bitcoincore.org/en/segwit_wallet_dev/" }, "here"),
        ".",
        React.createElement("br", null),
        React.createElement("br", null),
        "Do not use this address on mainnet, or outside of this plugin.",
        React.createElement("br", null),
        React.createElement("br", null),
        publicKey ? (React.createElement("div", null,
            React.createElement("h1", null,
                "Public Key ",
                React.createElement(HelpIcon, { identifier: "public-key" }),
                " "),
            React.createElement(HelpMessage, { identifier: "public-key", message: publicKeyMessage }),
            React.createElement("pre", null, publicKey))) : (React.createElement("div", null,
            React.createElement("h1", null,
                "Witness Script ",
                React.createElement(HelpIcon, { identifier: "witness-script" })),
            React.createElement(HelpMessage, { identifier: "witness-script", message: witnessScriptMessage }),
            React.createElement("pre", null, witnessScript))),
        React.createElement("br", null),
        React.createElement("h1", null,
            "Redeem Script ",
            React.createElement(HelpIcon, { identifier: "redeem-script" })),
        React.createElement(HelpMessage, { identifier: "redeem-script", message: redeemMessage }),
        React.createElement("pre", { className: "wrap" }, redeemScript),
        React.createElement("br", null),
        React.createElement("h1", null,
            "Address",
            React.createElement(HelpIcon, { identifier: "address" })),
        React.createElement(HelpMessage, { identifier: "address", message: addressMessage }),
        React.createElement("pre", { className: "wrap" }, testnetAddress)));
};
export let Opcodes = connect(mapStateToOpcodesProps)(OpcodesUnconnected);
export let Bytecode = connect(mapStateToBytecodeProps)(BytecodeUnconnected);
