import { AppState } from "./types"

export const getAppState = (state: AppState | any) => {
  if (state.getIn !== undefined) {
    return state.getIn(["ivy-plugin", "ivyState"])
  } else {
    return state
  }
}
