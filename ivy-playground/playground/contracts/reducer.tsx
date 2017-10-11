import { instantiate } from "ivy-compiler"
import { addParameterInput } from "../inputs/data"
import {
  ContractParameterType,
  HashFunction,
  Input,
  InputMap
} from "../inputs/types"
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
  SHOW_UNLOCK_INPUT_ERRORS,
  SPEND_CONTRACT,
  UPDATE_CLAUSE_INPUT,
  UPDATE_ERROR
} from "./actions"

import {
  Contract as IvyContract,
  TemplateClause,
  Transaction
} from "ivy-compiler"

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
    case CREATE_CONTRACT: {
      const instantiated: IvyContract = action.instantiated
      const template: Template = action.template
      const spendInputMap = generateSpendInputMap(template)
      const clauseNames = template.clauses.map(clause => clause.name)
      const clauseMap = generateClauseMap(template)
      const tx = instantiated.fundingTransaction
      const contract: Contract = {
        template: action.template as Template,
        inputMap: action.inputMap as InputMap,
        id: tx.hash,
        fundingTransaction: tx,
        spendInputMap,
        amount: instantiated.amount,
        unlockTxid: "",
        address: instantiated.address,
        witnessScript: instantiated.witnessScript,
        redeemScript: instantiated.redeemScript,
        scriptSig: instantiated.scriptSig,
        publicKey: instantiated.publicKey,
        clauseNames,
        clauseMap,
        instantiated
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
    case "@@router/LOCATION_CHANGE":
      const path = action.payload.pathname.split("/")
      if (path.length < 2) {
        return state
      }
      const pathId = path.pop()
      if (path.pop() === "unlock") {
        return {
          ...state,
          spendContractId: pathId,
          selectedClauseIndex: 0
        }
      }
      return state
    default:
      return state
  }
}
