import { isHash } from "ivy-bitcoin";
export { isHash };
export function getInputNameContext(name) {
    return name.split(".")[0];
}
export function getInputContext(input) {
    return getInputNameContext(input.name);
}
export function getParameterIdentifier(input) {
    switch (getInputContext(input)) {
        case "contractParameters":
            return input.name.split(".")[1];
        case "clauseParameters":
            return input.name.split(".")[2];
        default:
            throw new Error("unexpected input for getParameterIdentifier: " + input.name);
    }
}
export function getChild(input) {
    return input.name + "." + input.value;
}
export function isPrimaryInputType(str) {
    switch (str) {
        case "hashInput":
        case "numberInput":
        case "booleanInput":
        case "bytesInput":
        case "publicKeyInput":
        case "durationInput":
        case "timeInput":
        case "signatureInput":
        case "valueInput":
            return true;
        default:
            return false;
    }
}
export function isComplexType(inputType) {
    switch (inputType) {
        case "parameterInput":
        case "generateHashInput":
        case "hashInput":
        case "bytesInput":
        case "publicKeyInput":
        case "durationInput":
        case "timeInput":
        case "generatePublicKeyInput":
        case "generateSignatureInput":
        case "signatureInput":
        case "addressInput":
        case "lockTimeInput":
        case "sequenceNumberInput":
            return true;
        default:
            return false;
    }
}
export function isComplexInput(input) {
    return isComplexType(input.type);
}
export function getInputType(type) {
    if (isHash(type)) {
        return "hashInput";
    }
    switch (type) {
        case "Boolean":
            return "booleanInput";
        case "Integer":
            return "numberInput";
        case "Bytes":
            return "bytesInput";
        case "PublicKey":
            return "publicKeyInput";
        case "Duration":
            return "durationInput";
        case "Time":
            return "timeInput";
        case "Signature":
            return "signatureInput";
        case "Value":
            return "valueInput";
    }
}
