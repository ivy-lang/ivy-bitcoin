// external imports
import React from "react"
import { push } from "react-router-redux"

// ivy imports
import contracts from "../contracts"
import templates from "../templates"

import { DEMO_CONTRACTS, DEMO_ID_LIST } from "ivy-bitcoin"

export const RESET: string = "app/RESET"

export const reset = () => {
  return (dispatch, getState) => {
    let selected = templates.selectors.getSelectedTemplate(getState())
    if (selected === "" || DEMO_CONTRACTS[selected] === undefined) {
      selected = DEMO_ID_LIST[0]
    }
    dispatch(push("/"))
    dispatch({ type: RESET })
    dispatch(templates.actions.loadTemplate(selected))
  }
}
