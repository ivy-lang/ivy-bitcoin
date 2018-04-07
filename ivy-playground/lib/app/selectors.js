export const getAppState = (state) => {
    if (state.getIn !== undefined) {
        return state.getIn(["ivy-plugin", "ivyState"]);
    }
    else {
        return state;
    }
};
