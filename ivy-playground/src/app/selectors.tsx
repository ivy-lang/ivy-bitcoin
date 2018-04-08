import { static as Immutable } from "seamless-immutable"
import { AppState } from "./types"

export const getAppState = (state: AppState | any) => {
  if (state.plugins !== undefined) {
    return Immutable.asMutable(
      state.plugins.getIn(["ivy-plugin", "ivyState"]),
      { deep: true }
    )
  } else {
    return state
  }
}
