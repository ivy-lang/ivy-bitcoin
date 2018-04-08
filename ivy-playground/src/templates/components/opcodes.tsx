import React from "react"
import { Glyphicon } from "react-bootstrap"
import { connect } from "react-redux"
import ReactTooltip from "react-tooltip"

import { getInstantiated, getOpcodes } from "../selectors"
import { HelpIcon, HelpMessage } from "./helpicon"

const mapStateToOpcodesProps = state => {
  const opcodes = getOpcodes(state) || []
  // if (opcodes === undefined) throw "uncaught compiler error"
  return { opcodes }
}

const mapStateToBytecodeProps = state => {
  const instantiated = getInstantiated(state)
  const network = state.node.node.network
  return { instantiated, network }
}

const OpcodesUnconnected = ({ opcodes }) => {
  return (
    <div className="panel-body inner">
      <h1>Bitcoin Script</h1>
      <pre className="wrap">{opcodes.join(" ")}</pre>
    </div>
  )
}

const BytecodeUnconnected = ({
  instantiated: {
    publicKey,
    witnessScript,
    redeemScript,
    testnetAddress,
    mainnetAddress,
    simnetAddress
  },
  network
}) => {
  const address =
    network === "simnet"
      ? simnetAddress
      : network === "testnet" ? testnetAddress : mainnetAddress
  const witnessScriptMessage =
    "The compiled script (in hex), which will \
later be revealed in the witness of the spending transaction and evaluated \
against some arguments to validate the transaction."
  const publicKeyMessage =
    "The public key (in hex), which will later be revealed \
  in the witness of the spending transaction, along with a signature."
  const redeemMessage =
    "A script (in hex) that commits to the " +
    (publicKey ? "public key" : "witness script") +
    " and which will later be used in the scriptSig of the spending transaction."
  const addressMessage =
    "The address (in Base58) that you would use to fund this contract. \
 It appears in one of the outputs of the funding transactions."
  return (
    <div className="panel-body inner">
      This is a{" "}
      {publicKey ? "Pay-To-Witness-Public-Key" : "Pay-To-Witness-Script-Hash"}{" "}
      address. For more information on how SegWit addresses work, see{" "}
      <a href="https://bitcoincore.org/en/segwit_wallet_dev/">here</a>.
      <br />
      <br />
      Do not use this address on mainnet, or outside of this plugin.
      <br />
      <br />
      {publicKey ? (
        <div>
          <h1>
            Public Key <HelpIcon identifier="public-key" />{" "}
          </h1>
          <HelpMessage identifier="public-key" message={publicKeyMessage} />
          <pre>{publicKey}</pre>
        </div>
      ) : (
        <div>
          <h1>
            Witness Script <HelpIcon identifier="witness-script" />
          </h1>
          <HelpMessage
            identifier="witness-script"
            message={witnessScriptMessage}
          />
          <pre>{witnessScript}</pre>
        </div>
      )}
      <br />
      <h1>
        Redeem Script <HelpIcon identifier="redeem-script" />
      </h1>
      <HelpMessage identifier="redeem-script" message={redeemMessage} />
      <pre className="wrap">{redeemScript}</pre>
      <br />
      <h1>
        Address<HelpIcon identifier="address" />
      </h1>
      <HelpMessage identifier="address" message={addressMessage} />
      <pre className="wrap">{testnetAddress}</pre>
    </div>
  )
}

export let Opcodes = connect(mapStateToOpcodesProps)(OpcodesUnconnected)

export let Bytecode = connect(mapStateToBytecodeProps)(BytecodeUnconnected)
