// external imports
import { push } from "react-router-redux"

// ivy imports
import {
  setSource,
  updateError as updateCreateError
} from "../templates/actions"
import {
  getCompiled,
  getInputMap,
  getInstantiated,
  getSource
} from "../templates/selectors"

import { compile } from "ivy-bitcoin"

import { bwalletClient } from "@bpanel/bpanel-utils"

// internal imports
import {
  getFulfilledSpendTransaction,
  getResult,
  getSelectedClauseIndex,
  getSpendContract,
  getSpendContractId
} from "./selectors"

import { Contract } from "ivy-bitcoin"

export async function sendFundingTransaction(
  address: string,
  amount: number,
  client: any
): Promise<any> {
  return await client.send("primary", {
    outputs: [
      {
        address,
        value: amount
      }
    ]
  })
}

export const SHOW_UNLOCK_INPUT_ERRORS = "contracts/SHOW_UNLOCK_INPUT_ERRORS"

export const showUnlockInputErrors = (result: boolean) => {
  return {
    type: SHOW_UNLOCK_INPUT_ERRORS,
    result
  }
}

export const UPDATE_ERROR = "contracts/UPDATE_ERROR"

export const updateError = (error?) => {
  return {
    type: UPDATE_ERROR,
    error
  }
}

export const CREATE_CONTRACT = "contracts/CREATE_CONTRACT"

export const create = () => {
  return async (dispatch, getState) => {
    const state = getState()
    const inputMap = getInputMap(state)
    const template = getCompiled(state)
    const partialInstantiated = getInstantiated(state)
    if (partialInstantiated === undefined) {
      throw new Error("instantiated unexpectedly undefined")
    }
    const client = bwalletClient()
    const fundingTransaction = await sendFundingTransaction(
      partialInstantiated.simnetAddress,
      partialInstantiated.amount,
      client
    )
    let account
    account = await client.get(`/wallet/primary/account/ivy`, {})
    const withdrawalAddress = account.receiveAddress
    console.log(account)
    console.log(fundingTransaction)
    const instantiated: Contract = {
      fundingTransaction,
      ...partialInstantiated
    }
    dispatch({
      type: CREATE_CONTRACT,
      instantiated,
      template,
      inputMap,
      withdrawalAddress
    })
    dispatch(push("/unlock"))
  }
}

export const SPEND_CONTRACT = "contracts/SPEND_CONTRACT"

export const spend = () => {
  return async (dispatch, getState) => {
    const state = getState()
    const contract = getSpendContract(state)

    const spendTx = getFulfilledSpendTransaction(state)

    const result = getResult(state)

    const client = new NodeClient({ port: 5000, path: "/bcoin" })

    if (result.success) {
      await client.execute("sendrawtransaction", spendTx.hash())

      dispatch({
        type: SPEND_CONTRACT,
        unlockTxid: spendTx.hash("hex"),
        contract
      })
    } else {
      throw Error("spend called with invalid contract")
      // console.log(result)
    }

    dispatch(push("/unlock"))
  }
}

export const SET_CLAUSE_INDEX = "contracts/SET_CLAUSE_INDEX"

export const setClauseIndex = (selectedClauseIndex: number) => {
  return {
    type: SET_CLAUSE_INDEX,
    selectedClauseIndex
  }
}

export const UPDATE_INPUT = "contracts/UPDATE_INPUT"

export const updateInput = (name: string, newValue: string) => {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_INPUT,
      name,
      newValue
    })
  }
}

export const UPDATE_CLAUSE_INPUT = "contracts/UPDATE_CLAUSE_INPUT"

export const updateClauseInput = (name: string, newValue: string) => {
  return (dispatch, getState) => {
    const state = getState()
    const contractId = getSpendContractId(state)
    dispatch({
      type: UPDATE_CLAUSE_INPUT,
      contractId,
      name,
      newValue
    })
    // dispatch(updateError())
  }
}
