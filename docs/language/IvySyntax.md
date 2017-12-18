# Ivy Syntax

Ivy gives you essentially all the flexibility of Bitcoin Script, but gives you some additional affordances and conveniences:

  * named variables
  * named "clauses"
  * static (and domain-specific) [types](/language/Types.html)
  * familiar syntax for [functions and operators](/language/Functions.html)

This is an example of an Ivy contract template:

```
contract LockWithPublicKey(publicKey: PublicKey, val: Value) {
  clause spend(sig: Signature) {
    verify checkSig(publicKey, sig)
    unlock val
  }
}
```

Each contract template needs to be passed some *contract arguments* to turn it into a contract. Each argument has a [type](/language/Types.html), such as PublicKey, Value, or Signature. 

This contract can be parameterized with a cryptographic public key, **publicKey**, to create an address.

You must also pass some *Value*—the Bitcoins to be protected. Every contract template has such a parameter, in this case named **val**. To instantiate this contract on the Bitcoin mainnet, you would need to provide some amount of BTC—actual value, not just data.

Each contract has one or more *clauses*. To unlock the contract, you need to invoke one of its clauses, pass it one or more *clause arguments*—in this case, a signature—and satisfy each of its conditions.

In this case, the **spend** clause only enforces one condition. It uses the *checkSig* [function](/language/Functions.html) to enforce that **sig** must be a valid signature on the transaction by the private key corresponding to the prespecified **publicKey**.

Finally, each clause needs to unlock the locked value, with a statement like *unlock val*.