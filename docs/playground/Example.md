# Example

Here’s an illustration of creating and spending the [LockWithPublicKey](/language/ExampleContracts.html#lockwithpublickey) contract in the Ivy Playground.

### Creating contracts

The LockWithPublicKey contract works like a typical Bitcoin address (in fact, the generated address is indistinguishable from a normal SegWit testnet address). To create it, you provide a public key, and some Bitcoin. To unlock the contract, you can sign the spending transaction with the private key that corresponds to tat public key.

To create the contract, you provide a public key, **publicKey**, and fund the contract with some Bitcoins, **val**. The playground allows you to generate a keypair, or provide your own public or private key. (For security, do not paste your real Bitcoin private key into the playground!) The Bitcoins represented by **val** are locked up until the contract is spent.

### Unlocking contracts

To unlock value from the contract, you must call the **spend** clause and provide a signature, **sig**. In the playground, you can generate this signature by pasting in a private key. The contract then uses *checkSig* to confirm that **sig** is a valid signature on the spending transaction by the private key corresponding to **publicKey**. If this operation fails, the attempt to spend the contract fails as well. If it succeeds, **val** is unlocked.
