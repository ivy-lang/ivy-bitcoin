import * as contracts from "../contracts/types"
import * as templates from "../templates/types"

export interface AppState {
  contracts: contracts.ContractsState
  templates: templates.TemplateState
  routing: any
}
