import { instantiate } from "ivy-bitcoin"
import { addParameterInput } from "../inputs/data"
import {
  ContractParameterType,
  HashFunction,
  Input,
  InputMap
} from "../inputs/types"
import { UPDATE_COMPILED } from "../templates/actions"
import { getParameterIds } from "../templates/selectors"
import { getInputMap } from "../templates/selectors"
import { Template } from "../templates/types"
// external imports
import { ContractsState } from "./types"

// ivy imports
import { AppState } from "../app/types"
import { addDefaultInput } from "../inputs/data"
import { Contract } from "./types"

// internal imports
import {
  CREATE_CONTRACT,
  SET_CLAUSE_INDEX,
  SET_UNLOCK_CONTRACT,
  SHOW_UNLOCK_INPUT_ERRORS,
  SPEND_CONTRACT,
  TIMEOUT_LOCK_ERROR,
  UPDATE_CLAUSE_INPUT,
  UPDATE_ERROR,
  UPDATE_INPUT,
  UPDATE_LOCK_ERROR
} from "./actions"

import {
  Contract as IvyContract,
  TemplateClause,
  Transaction
} from "ivy-bitcoin"

export const INITIAL_STATE: ContractsState = {
  contractMap: {},
  idList: [],
  spentIdList: [],
  spendContractId: "",
  selectedClauseIndex: 0,
  showUnlockInputErrors: false,
  error: undefined
}

export interface ClauseMap {
  [s: string]: TemplateClause
}

function generateClauseMap(template: Template): ClauseMap {
  const clauseMap: ClauseMap = {}
  for (const clause of template.clauses) {
    clauseMap[clause.name] = clause
  }
  return clauseMap
}

function generateSpendInputMap(template: Template): InputMap {
  const clauseParameterIds = {}
  const inputs: Input[] = []
  for (const clause of template.clauses) {
    clauseParameterIds[clause.name] = clause.parameters.map(
      param => "clauseParameters." + clause.name + "." + param.name
    )
    for (const parameter of clause.parameters) {
      addParameterInput(
        inputs,
        parameter.valueType,
        "clauseParameters." + clause.name + "." + parameter.name
      )
    }
  }
  addDefaultInput(inputs, "lockTimeInput", "transactionDetails")
  addDefaultInput(inputs, "sequenceNumberInput", "transactionDetails")
  const spendInputsById: InputMap = {}
  for (const input of inputs) {
    spendInputsById[input.name] = input
  }
  return spendInputsById
}

export default function reducer(
  state: ContractsState = INITIAL_STATE,
  action
): ContractsState {
  switch (action.type) {
    case SPEND_CONTRACT: {
      const contract = action.contract
      const contractId = contract.id
      return {
        ...state,
        contractMap: {
          ...state.contractMap,
          [contractId]: {
            ...contract,
            unlockTxid: action.unlockTxid
          }
        },
        idList: state.idList.filter(id => id !== contractId),
        spentIdList: [contractId, ...state.spentIdList],
        error: undefined
      }
    }
    case SHOW_UNLOCK_INPUT_ERRORS: {
      return {
        ...state,
        showUnlockInputErrors: action.result
      }
    }
    case UPDATE_COMPILED:
    case TIMEOUT_LOCK_ERROR:
    case UPDATE_INPUT: {
      return {
        ...state,
        lockError: undefined
      }
    }
    case CREATE_CONTRACT: {
      const instantiated: IvyContract = action.instantiated
      if (instantiated.fundingTransaction === undefined) {
        throw new Error("did not expect funding transaction to be undefined")
      }
      const template: Template = action.template
      const withdrawAddress: string = action.withdrawAddress
      const spendInputMap = generateSpendInputMap(template)
      const clauseNames = template.clauses.map(clause => clause.name)
      const clauseMap = generateClauseMap(template)
      const tx = instantiated.fundingTransaction
      const contract: Contract = {
        inputMap: action.inputMap as InputMap,
        id: tx.hash,
        spendInputMap,
        unlockTxid: undefined,
        clauseMap,
        instantiated,
        withdrawAddress
      }
      const contractId = contract.id
      return {
        ...state,
        contractMap: {
          ...state.contractMap,
          [contractId]: contract
        },
        idList: [...state.idList, contractId]
      }
    }
    case UPDATE_CLAUSE_INPUT: {
      // gotta find a way to make this less nested
      // maybe further normalizing it; maybe Immutable.js or cursors or something
      const contractId = action.contractId as string
      const oldContract = state.contractMap[action.contractId]
      const oldSpendInputMap = oldContract.spendInputMap
      const oldInput = oldSpendInputMap[action.name]
      if (oldInput === undefined) {
        throw new Error("unexpectedly undefined clause input")
      }
      return {
        ...state,
        contractMap: {
          ...state.contractMap,
          [action.contractId]: {
            ...oldContract,
            spendInputMap: {
              ...oldSpendInputMap,
              [action.name]: {
                ...oldInput,
                value: action.newValue
              }
            }
          }
        }
      }
    }
    case SET_CLAUSE_INDEX: {
      return {
        ...state,
        selectedClauseIndex: action.selectedClauseIndex
      }
    }
    case UPDATE_ERROR: {
      return {
        ...state,
        error: action.error
      }
    }
    case UPDATE_LOCK_ERROR: {
      return {
        ...state,
        lockError: action.error
      }
    }
    case SET_UNLOCK_CONTRACT: {
      return {
        ...state,
        spendContractId: action.contractId,
        selectedClauseIndex: 0
      }
    }
    default:
      return state
  }
}
