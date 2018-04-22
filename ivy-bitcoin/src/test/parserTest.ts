import { expect } from 'chai';
import { RawContract } from "../ast"
import 'mocha';

const parser = require("../parser")

const source = "contract LockWithPublicKey(publicKey: PublicKey, val: Value){clause spend(sig: Signature) {verify checkSig(publicKey, sig)}}"

describe('Parameter function', () => {
  it('should have length 2', () => {
    const rawAst = parser.parse(source) as RawContract;
    const parameters = rawAst.parameters;
    expect(parameters.length).to.equal(2);
  });

});
