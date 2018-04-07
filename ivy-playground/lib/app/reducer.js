// external imports
import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";
// ivy imports
import contracts from "../contracts";
import templates from "../templates";
// internal imports
import * as actions from "./actions";
export default function reducer(state, action) {
    switch (action.type) {
        case actions.RESET:
            return {
                contracts: contracts.reducer(undefined, {}),
                templates: templates.reducer(undefined, {}),
                routing: state.routing
            };
        default:
            return combineReducers({
                contracts: contracts.reducer,
                templates: templates.reducer,
                routing: routerReducer
            })(state, action);
    }
}
