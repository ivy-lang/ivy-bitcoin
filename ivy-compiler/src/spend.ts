import { Template } from "./template"

import { Contract, Transaction } from "./instantiate"

import {
  address as Address,
  crypto,
  mtx as Mtx,
  opcode as Opcode,
  outpoint as Outpoint,
  script as Script,
  tx as Tx,
  witness as Witness
} from "bcoin"

export const toSighash = (
  instantiated: Contract,
  spendTransaction: Transaction,
  amount: number
) => {
  if (spendTransaction === undefined) {
    return undefined
  }
  try {
    const script = instantiated.publicKey
      ? Script.fromPubkeyhash(
          crypto.hash160(Buffer.from(instantiated.publicKey, "hex"))
        )
      : Script.fromRaw(Buffer.from(instantiated.witnessScript, "hex"))
    return spendTransaction.signatureHash(0, script, amount, 1, 1)
  } catch (e) {
    return undefined
  }
}

export const spend = (
  spendSourceTransaction: any,
  spendDestinationAddress: any,
  amount: number,
  locktime: number,
  sequenceNumber: { sequence: number; seconds: boolean }
) => {
  const sourceTransaction = Tx.fromJSON(spendSourceTransaction)
  const m = new Mtx()
  m.addTX(sourceTransaction, 0)
  m.addOutput({
    address: spendDestinationAddress,
    value: amount
  })
  m.setLocktime(locktime)
  m.setSequence(0, sequenceNumber.sequence, sequenceNumber.seconds)
  return m
}

export function toBuf(arg: Buffer | number | string) {
  if (typeof arg === "number") {
    return Opcode.fromInt(arg)
      .toNum()
      .toRaw() // roundabout, but seems to be the only exposed way
  } else if (typeof arg === "string") {
    return Buffer.from(arg, "hex")
  } else {
    return arg
  }
}

export const fulfill = (
  instantiated: Contract,
  spendTx: any,
  witnessArgs: any[],
  spendClauseName: string
) => {
  const spendTransaction = spendTx.clone()
  // deal with a weird bug in the cloning
  spendTransaction.view = spendTx.view
  const scriptSig = instantiated.scriptSig
  const witnessScript = instantiated.publicKey
    ? Buffer.from(instantiated.publicKey, "hex")
    : Buffer.from(instantiated.witnessScript, "hex")
  const realClauses = instantiated.template.clauses
  const spendClauseIndex = realClauses
    .map(clause => clause.name)
    .indexOf(spendClauseName)
  if (spendClauseIndex === -1) {
    throw new Error("could not find clause: " + spendClauseName)
  }
  const numClauses = instantiated.template.clauses.length
  const generatedArgs = witnessArgs.reverse().map(toBuf)
  const maybeClauseArg = numClauses > 1 ? [toBuf(spendClauseIndex)] : []
  const allWitnessArgs = [...generatedArgs, ...maybeClauseArg, witnessScript]
  const witness = Witness.fromArray(allWitnessArgs)
  spendTransaction.inputs[0].script = Script.fromRaw(
    Buffer.from(scriptSig, "hex")
  )
  spendTransaction.inputs[0].witness = witness
  return spendTransaction
}
