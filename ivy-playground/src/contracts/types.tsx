import { Input, InputMap } from "../inputs/types"

import { Template, TemplateClause } from "../templates/types"

import { Contract as IvyContract } from "bitcoin-ivy"

export interface Contract {
  // lock tx id
  id: string
  unlockTxid: string
  amount: number
  template: Template
  address: string
  redeemScript: string
  witnessScript: string
  scriptSig: string

  fundingTransaction: {}

  // Map of UI Form inputs
  // used during locking tx.
  inputMap: InputMap

  // Map of UI Form inputs
  // used during unlocking tx.
  spendInputMap: InputMap

  // Details on the contract clauses.
  clauseNames: string[]
  clauseMap: {
    [s: string]: TemplateClause
  }
  publicKey?: string
  instantiated: IvyContract
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
