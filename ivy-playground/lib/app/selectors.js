export const getAppState = (state) => {
    if (state.plugins !== undefined) {
        return state.plugins.getIn(["ivy-plugin", "ivyState"]);
    }
    else {
        return state;
    }
};
