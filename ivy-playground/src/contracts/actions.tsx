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

import { bpanelClient, bwalletClient } from "@bpanel/bpanel-utils"

// internal imports
import {
  getFulfilledSpendTransaction,
  getResult,
  getSelectedClauseIndex,
  getSpendContract,
  getSpendContractId
} from "./selectors"

import { Contract } from "ivy-bitcoin"

export const SHOW_UNLOCK_INPUT_ERRORS = "contracts/SHOW_UNLOCK_INPUT_ERRORS"

export const showUnlockInputErrors = (result: boolean) => {
  return {
    type: SHOW_UNLOCK_INPUT_ERRORS,
    result
  }
}

export const UPDATE_ERROR = "contracts/UPDATE_ERROR"
export const UPDATE_LOCK_ERROR = "contracts/UPDATE_LOCK_ERROR"
export const TIMEOUT_LOCK_ERROR = "contracts/TIMEOUT_LOCK_ERROR"

export const updateError = (error?) => {
  return {
    type: UPDATE_ERROR,
    error
  }
}

export const updateLockError = (error) => {
  return {
    type: UPDATE_LOCK_ERROR,
    error
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const timeoutLockError = () => {
  return async (dispatch) => {
    await sleep(5000)
    dispatch({
      type: TIMEOUT_LOCK_ERROR
    })
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
    // let account
    // try {
    //   account = await client.getAccount("primary", "ivy")
    // } catch(e) {
    //   account = await client.createAccount("primary", "ivy", { witness: true }) 
    // }
    let fundingTransaction
    try {
      fundingTransaction = await client.send("primary", {
        outputs: [
          {
            address: partialInstantiated.simnetAddress,
            value: partialInstantiated.amount
          }
        ]
      })
      if (fundingTransaction === null) {
        throw new Error("404 error (bcoin node not found)")
      }
    } catch(e) {
      dispatch(updateLockError(e.message))
      dispatch(timeoutLockError())
      return
    }
    // const withdrawalAddress = "whatever"// account.receiveAddress
    // const instantiated: Contract = {
    //   fundingTransaction,
    //   ...partialInstantiated
    // }
    // dispatch({
    //   type: CREATE_CONTRACT,
    //   instantiated,
    //   template,
    //   inputMap,
    //   withdrawalAddress
    // })
    // dispatch(push("/unlock"))
  }
}

export const SPEND_CONTRACT = "contracts/SPEND_CONTRACT"

export const spend = () => {
  return async (dispatch, getState) => {
    const state = getState()
    const contract = getSpendContract(state)

    const spendTx = getFulfilledSpendTransaction(state)

    const result = getResult(state)

    const client = bpanelClient()

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
