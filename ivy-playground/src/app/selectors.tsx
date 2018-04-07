import { AppState } from "./types"


export const getAppState = (state: AppState | any) => {
  if (state.plugins !== undefined) {
    return state.plugins.getIn(["ivy-plugin", "ivyState"])
  } else {
    return state
  }
}
