import { static as Immutable } from "seamless-immutable";
export const getAppState = (state) => {
    if (state.plugins !== undefined) {
        return Immutable.asMutable(state.plugins.getIn(["ivy-plugin", "ivyState"]), { deep: true });
    }
    else {
        return state;
    }
};
