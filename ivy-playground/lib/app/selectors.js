export const getAppState = (state) => {
    if (state.getIn !== undefined) {
        return state.getIn(["plugins", "ivy-plugin", "ivyState"]);
    }
    else {
        return state;
    }
};
