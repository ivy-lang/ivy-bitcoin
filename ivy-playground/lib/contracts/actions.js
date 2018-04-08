var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// external imports
import { push } from "react-router-redux";
import { getCompiled, getInputMap, getInstantiated } from "../templates/selectors";
import { bpanelClient, bwalletClient } from "@bpanel/bpanel-utils";
// internal imports
import { getFulfilledSpendTransaction, getResult, getSpendContract, getSpendContractId } from "./selectors";
export const SHOW_UNLOCK_INPUT_ERRORS = "contracts/SHOW_UNLOCK_INPUT_ERRORS";
export const showUnlockInputErrors = (result) => {
    return {
        type: SHOW_UNLOCK_INPUT_ERRORS,
        result
    };
};
export const UPDATE_ERROR = "contracts/UPDATE_ERROR";
export const UPDATE_LOCK_ERROR = "contracts/UPDATE_LOCK_ERROR";
export const TIMEOUT_LOCK_ERROR = "contracts/TIMEOUT_LOCK_ERROR";
export const updateError = (error) => {
    return {
        type: UPDATE_ERROR,
        error
    };
};
export const updateLockError = (error) => {
    return {
        type: UPDATE_LOCK_ERROR,
        error
    };
};
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export const timeoutLockError = () => {
    return (dispatch) => __awaiter(this, void 0, void 0, function* () {
        yield sleep(5000);
        dispatch({
            type: TIMEOUT_LOCK_ERROR
        });
    });
};
export const SET_UNLOCK_CONTRACT = "contracts/SET_UNLOCK_CONTRACT";
export function setUnlockContract(contractId) {
    return (dispatch) => {
        dispatch({
            type: SET_UNLOCK_CONTRACT,
            contractId
        });
        dispatch(push('/ivy-plugin-unlock'));
    };
}
export const CREATE_CONTRACT = "contracts/CREATE_CONTRACT";
export const create = () => {
    return (dispatch, getState) => __awaiter(this, void 0, void 0, function* () {
        const state = getState();
        const inputMap = getInputMap(state);
        const template = getCompiled(state);
        const instantiated = getInstantiated(state);
        if (instantiated === undefined) {
            throw new Error("instantiated unexpectedly undefined");
        }
        const client = bwalletClient();
        let account;
        try {
            account = yield client.getAccount("primary", "ivy");
            if (account === null) {
                throw new Error("404");
            }
        }
        catch (e) {
            account = yield client.createAccount("primary", "ivy", { witness: true });
        }
        let fundingTransaction;
        try {
            fundingTransaction = yield client.send("primary", {
                outputs: [
                    {
                        address: instantiated.simnetAddress,
                        value: instantiated.amount
                    }
                ]
            });
            if (fundingTransaction === null) {
                throw new Error("404 error (bcoin node not found)");
            }
        }
        catch (e) {
            dispatch(updateLockError(e.message));
            dispatch(timeoutLockError());
            return;
        }
        const withdrawalAddress = account.receiveAddress;
        dispatch({
            type: CREATE_CONTRACT,
            instantiated,
            template,
            inputMap,
            withdrawalAddress
        });
        dispatch(push("/ivy-plugin-view"));
    });
};
export const SPEND_CONTRACT = "contracts/SPEND_CONTRACT";
export const spend = () => {
    return (dispatch, getState) => __awaiter(this, void 0, void 0, function* () {
        const state = getState();
        const contract = getSpendContract(state);
        const spendTx = getFulfilledSpendTransaction(state);
        const result = getResult(state);
        const client = bpanelClient();
        if (result.success) {
            yield client.execute("sendrawtransaction", spendTx.hash());
            dispatch({
                type: SPEND_CONTRACT,
                unlockTxid: spendTx.hash("hex"),
                contract
            });
        }
        else {
            throw Error("spend called with invalid contract");
            // console.log(result)
        }
        dispatch(push("/ivy-plugin-view"));
    });
};
export const SET_CLAUSE_INDEX = "contracts/SET_CLAUSE_INDEX";
export const setClauseIndex = (selectedClauseIndex) => {
    return {
        type: SET_CLAUSE_INDEX,
        selectedClauseIndex
    };
};
export const UPDATE_INPUT = "contracts/UPDATE_INPUT";
export const updateInput = (name, newValue) => {
    return (dispatch, getState) => {
        dispatch({
            type: UPDATE_INPUT,
            name,
            newValue
        });
    };
};
export const UPDATE_CLAUSE_INPUT = "contracts/UPDATE_CLAUSE_INPUT";
export const updateClauseInput = (name, newValue) => {
    return (dispatch, getState) => {
        const state = getState();
        const contractId = getSpendContractId(state);
        dispatch({
            type: UPDATE_CLAUSE_INPUT,
            contractId,
            name,
            newValue
        });
        // dispatch(updateError())
    };
};
