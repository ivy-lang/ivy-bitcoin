# Syntax

This is an example of an Ivy contract template.

```
contract LockWithPublicKey(publicKey: PublicKey, val: Value) {
  clause spend(sig: Signature) {
    verify checkSig(publicKey, sig)
    unlock val
  }
}
```

This contract can be parameterized with a cryptographic public key, *publicKey*, to create an address.

To instantiate it as a contract, you must also pass some *Value*—the Bitcoins to be protected. Each contract has a parameter of type Value, in this case named *val*. To instantiate this contract on the Bitcoin mainnet, you would need to provide some amount of BTC—actual value, not just data.

Each contract has one or more _clauses_. To unlock the contract, you need to invoke one of its clauses, pass it one or more *clause arguments*—in this case, a signature—and satisfy each of its conditions. In this case, the only condition enforced by the *spend* clause is that *sig* must be a valid signature on the transaction by the private key corresponding to the prespecified *publicKey*.

Finally, each clause needs to unlock the value.