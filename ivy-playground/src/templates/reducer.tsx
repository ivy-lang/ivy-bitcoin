// ivy imports
import { CREATE_CONTRACT, UPDATE_INPUT } from "../contracts/actions"
import { generateInputMap } from "../contracts/selectors"
import { InputMap } from "../inputs/types"
import { Template, TemplateState } from "./types"

// internal imports
import { DEMO_CONTRACTS, DEMO_ID_LIST } from "ivy-bitcoin"
import {
  SAVE_TEMPLATE,
  SET_SOURCE,
  SHOW_LOCK_INPUT_ERRORS,
  UPDATE_COMPILED,
  UPDATE_ERROR
} from "./actions"

const INITIAL_STATE: TemplateState = {
  sourceMap: DEMO_CONTRACTS,
  idList: DEMO_ID_LIST,
  source: DEMO_CONTRACTS[DEMO_ID_LIST[0]],
  inputMap: undefined,
  compiled: undefined,
  showLockInputErrors: false,
  error: undefined
}

export default function reducer(
  state: TemplateState = INITIAL_STATE,
  action
): TemplateState {
  switch (action.type) {
    case UPDATE_INPUT: {
      const name = action.name
      const newValue = action.newValue
      if (state.inputMap === undefined) {
        return state
      }
      return {
        ...state,
        inputMap: {
          ...state.inputMap,
          [name]: {
            ...state.inputMap[name],
            value: newValue
          }
        }
      }
    }
    case CREATE_CONTRACT: {
      return {
        ...state,
        inputMap: state.compiled
          ? generateInputMap(state.compiled)
          : state.inputMap
      }
    }
    case SET_SOURCE: {
      const source = action.source
      return {
        ...state,
        source
      }
    }
    case SAVE_TEMPLATE: {
      const compiled = state.compiled
      if (
        compiled === undefined ||
        state.sourceMap[compiled.name] !== undefined
      ) {
        return state // this shouldn't happen
      }
      return {
        ...state,
        idList: [...state.idList, compiled.name],
        sourceMap: {
          ...state.sourceMap,
          [compiled.name]: compiled.source
        }
      }
    }
    case UPDATE_ERROR: {
      return {
        ...state,
        compiled: undefined,
        error: action.error
      }
    }
    case UPDATE_COMPILED: {
      const compiled = action.compiled
      const inputMap = generateInputMap(compiled)
      return {
        ...state,
        compiled,
        inputMap,
        error: undefined
      }
    }
    case SHOW_LOCK_INPUT_ERRORS: {
      return {
        ...state,
        showLockInputErrors: action.result
      }
    }
    default:
      return state
  }
}
