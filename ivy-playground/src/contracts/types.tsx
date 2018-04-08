import { Input, InputMap } from "../inputs/types"

import { Template, TemplateClause } from "../templates/types"

import { Contract as IvyContract } from "ivy-bitcoin"

export interface Contract {
  // lock tx id
  id: string
  unlockTxid?: string

  // Map of UI Form inputs
  // used during locking tx.
  inputMap: InputMap

  // Map of UI Form inputs
  // used during unlocking tx.
  spendInputMap: InputMap

  // Details on the contract clauses.
  clauseMap: {
    [s: string]: TemplateClause
  }
  instantiated: IvyContract

  withdrawAddress: string
}

export interface ContractMap {
  [s: string]: Contract
}

export interface ContractsState {
  contractMap: ContractMap
  idList: string[]
  spentIdList: string[]
  spendContractId: string
  selectedClauseIndex: number
  showUnlockInputErrors: boolean
  error?: string
}
