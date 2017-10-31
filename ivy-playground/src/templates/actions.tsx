// internal imports
import { compile, DEMO_ID_LIST } from "bitcoin-ivy"
import { getSourceMap } from "./selectors"
import { Template } from "./types"

export const SHOW_LOCK_INPUT_ERRORS = "templates/SHOW_LOCK_INPUT_ERRORS"

export const showLockInputErrors = (result: boolean) => {
  return {
    type: SHOW_LOCK_INPUT_ERRORS,
    result
  }
}

export const loadTemplate = (selected: string) => {
  return (dispatch, getState) => {
    if (!selected) {
      selected = DEMO_ID_LIST[0]
    }
    const state = getState()
    const source = getSourceMap(state)[selected]
    dispatch(setSource(source))
  }
}

export const UPDATE_ERROR = "templates/UPDATE_ERROR"

export const updateError = (error?) => {
  return {
    type: UPDATE_ERROR,
    error
  }
}

export const SET_SOURCE = "templates/SET_SOURCE"

export const setSource = (source: string) => {
  return (dispatch, getState) => {
    const type = SET_SOURCE
    dispatch({ type, source })

    const compiled = compile(source)

    if (compiled.type === "compilerError") {
      dispatch(updateError(compiled.message))
    } else {
      dispatch(updateCompiled(compiled))
    }
  }
}

export const SAVE_TEMPLATE = "templates/SAVE_TEMPLATE"

export const saveTemplate = () => ({ type: SAVE_TEMPLATE })

export const UPDATE_COMPILED = "templates/UPDATE_COMPILED"

export const updateCompiled = (compiled: Template) => {
  return {
    type: UPDATE_COMPILED,
    compiled
  }
}
