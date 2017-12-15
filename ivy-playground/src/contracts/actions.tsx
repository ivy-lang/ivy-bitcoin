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

// internal imports
import {
  getFulfilledSpendTransaction,
  getResult,
  getSelectedClauseIndex,
  getSpendContract,
  getSpendContractId
} from "./selectors"

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
  return (dispatch, getState) => {
    const state = getState()
    const inputMap = getInputMap(state)
    const template = getCompiled(state)
    const instantiated = getInstantiated(state)
    dispatch({
      type: CREATE_CONTRACT,
      instantiated,
      template,
      inputMap
    })
    dispatch(push("/unlock"))
  }
}

export const SPEND_CONTRACT = "contracts/SPEND_CONTRACT"

export const spend = () => {
  return (dispatch, getState) => {
    const state = getState()
    const contract = getSpendContract(state)

    const spendTx = getFulfilledSpendTransaction(state)

    const result = getResult(state)

    if (result.success) {
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
