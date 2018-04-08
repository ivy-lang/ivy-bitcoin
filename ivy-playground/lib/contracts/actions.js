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
import { NodeClient, WalletClient } from "bclient";
// internal imports
import { getFulfilledSpendTransaction, getResult, getSpendContract, getSpendContractId } from "./selectors";
export function sendFundingTransaction(address, amount, client) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client.send("primary", {
            outputs: [
                {
                    address,
                    value: amount
                }
            ]
        });
    });
}
export const SHOW_UNLOCK_INPUT_ERRORS = "contracts/SHOW_UNLOCK_INPUT_ERRORS";
export const showUnlockInputErrors = (result) => {
    return {
        type: SHOW_UNLOCK_INPUT_ERRORS,
        result
    };
};
export const UPDATE_ERROR = "contracts/UPDATE_ERROR";
export const updateError = (error) => {
    return {
        type: UPDATE_ERROR,
        error
    };
};
export const CREATE_CONTRACT = "contracts/CREATE_CONTRACT";
export const create = () => {
    return (dispatch, getState) => __awaiter(this, void 0, void 0, function* () {
        const state = getState();
        const inputMap = getInputMap(state);
        const template = getCompiled(state);
        const partialInstantiated = getInstantiated(state);
        if (partialInstantiated === undefined) {
            throw new Error("instantiated unexpectedly undefined");
        }
        const client = new WalletClient({ port: 5000, path: "/bwallet" });
        console.log("client", client);
        const fundingTransaction = yield sendFundingTransaction(partialInstantiated.simnetAddress, partialInstantiated.amount, client);
        let account;
        account = yield client.get(`/wallet/primary/account/ivy`, {});
        const withdrawalAddress = account.receiveAddress;
        console.log(account);
        console.log(fundingTransaction);
        const instantiated = Object.assign({ fundingTransaction }, partialInstantiated);
        dispatch({
            type: CREATE_CONTRACT,
            instantiated,
            template,
            inputMap,
            withdrawalAddress
        });
        dispatch(push("/unlock"));
    });
};
export const SPEND_CONTRACT = "contracts/SPEND_CONTRACT";
export const spend = () => {
    return (dispatch, getState) => __awaiter(this, void 0, void 0, function* () {
        const state = getState();
        const contract = getSpendContract(state);
        const spendTx = getFulfilledSpendTransaction(state);
        const result = getResult(state);
        const client = new NodeClient({ port: 5000, path: "/bcoin" });
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
        dispatch(push("/unlock"));
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
