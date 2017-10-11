# Unlocking contracts

To unlock value from the contract, you must call the **spend** clause and provide a signature, **sig**. In the playground, you can generate this signature by pasting in a private key. The contract then uses *checkSig* to confirm that **sig** is a valid signature on the spending transaction by the private key corresponding to **publicKey**. If this operation fails, the attempt to spend the contract fails as well. If it succeeds, **val** is unlocked.
