import { addParameterInput } from "../inputs/data";
import { UPDATE_COMPILED } from "../templates/actions";
import { addDefaultInput } from "../inputs/data";
// internal imports
import { CREATE_CONTRACT, SET_CLAUSE_INDEX, SHOW_UNLOCK_INPUT_ERRORS, SPEND_CONTRACT, TIMEOUT_LOCK_ERROR, UPDATE_CLAUSE_INPUT, UPDATE_ERROR, UPDATE_INPUT, UPDATE_LOCK_ERROR } from "./actions";
export const INITIAL_STATE = {
    contractMap: {},
    idList: [],
    spentIdList: [],
    spendContractId: "",
    selectedClauseIndex: 0,
    showUnlockInputErrors: false,
    error: undefined
};
function generateClauseMap(template) {
    const clauseMap = {};
    for (const clause of template.clauses) {
        clauseMap[clause.name] = clause;
    }
    return clauseMap;
}
function generateSpendInputMap(template) {
    const clauseParameterIds = {};
    const inputs = [];
    for (const clause of template.clauses) {
        clauseParameterIds[clause.name] = clause.parameters.map(param => "clauseParameters." + clause.name + "." + param.name);
        for (const parameter of clause.parameters) {
            addParameterInput(inputs, parameter.valueType, "clauseParameters." + clause.name + "." + parameter.name);
        }
    }
    addDefaultInput(inputs, "lockTimeInput", "transactionDetails");
    addDefaultInput(inputs, "sequenceNumberInput", "transactionDetails");
    const spendInputsById = {};
    for (const input of inputs) {
        spendInputsById[input.name] = input;
    }
    return spendInputsById;
}
export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case SPEND_CONTRACT: {
            const contract = action.contract;
            const contractId = contract.id;
            return Object.assign({}, state, { contractMap: Object.assign({}, state.contractMap, { [contractId]: Object.assign({}, contract, { unlockTxid: action.unlockTxid }) }), idList: state.idList.filter(id => id !== contractId), spentIdList: [contractId, ...state.spentIdList], error: undefined });
        }
        case SHOW_UNLOCK_INPUT_ERRORS: {
            return Object.assign({}, state, { showUnlockInputErrors: action.result });
        }
        case UPDATE_COMPILED:
        case TIMEOUT_LOCK_ERROR:
        case UPDATE_INPUT: {
            return Object.assign({}, state, { lockError: undefined });
        }
        case CREATE_CONTRACT: {
            const instantiated = action.instantiated;
            if (instantiated.fundingTransaction === undefined) {
                throw new Error("did not expect funding transaction to be undefined");
            }
            const template = action.template;
            const withdrawAddress = action.withdrawAddress;
            const spendInputMap = generateSpendInputMap(template);
            const clauseNames = template.clauses.map(clause => clause.name);
            const clauseMap = generateClauseMap(template);
            const tx = instantiated.fundingTransaction;
            const contract = {
                inputMap: action.inputMap,
                id: tx.hash,
                spendInputMap,
                unlockTxid: undefined,
                clauseMap,
                instantiated,
                withdrawAddress
            };
            const contractId = contract.id;
            return Object.assign({}, state, { contractMap: Object.assign({}, state.contractMap, { [contractId]: contract }), idList: [...state.idList, contractId] });
        }
        case UPDATE_CLAUSE_INPUT: {
            // gotta find a way to make this less nested
            // maybe further normalizing it; maybe Immutable.js or cursors or something
            const contractId = action.contractId;
            const oldContract = state.contractMap[action.contractId];
            const oldSpendInputMap = oldContract.spendInputMap;
            const oldInput = oldSpendInputMap[action.name];
            if (oldInput === undefined) {
                throw new Error("unexpectedly undefined clause input");
            }
            return Object.assign({}, state, { contractMap: Object.assign({}, state.contractMap, { [action.contractId]: Object.assign({}, oldContract, { spendInputMap: Object.assign({}, oldSpendInputMap, { [action.name]: Object.assign({}, oldInput, { value: action.newValue }) }) }) }) });
        }
        case SET_CLAUSE_INDEX: {
            return Object.assign({}, state, { selectedClauseIndex: action.selectedClauseIndex });
        }
        case UPDATE_ERROR: {
            return Object.assign({}, state, { error: action.error });
        }
        case UPDATE_LOCK_ERROR: {
            return Object.assign({}, state, { lockError: action.error });
        }
        case "@@router/LOCATION_CHANGE":
            const path = action.payload.pathname.split("/");
            if (path.length < 2) {
                return state;
            }
            const pathId = path.pop();
            if (path.pop() === "ivy-plugin-view") {
                return Object.assign({}, state, { spendContractId: pathId, selectedClauseIndex: 0 });
            }
            return state;
        default:
            return state;
    }
}
