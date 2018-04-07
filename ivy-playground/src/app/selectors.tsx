import { AppState } from "./types"

export const getAppState = (state: AppState | any) => {
  if (state.getIn !== undefined) {
    return state.getIn(["plugins", "ivy-plugin", "ivyState"])
  } else {
    return state
  }
}
