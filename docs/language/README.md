# Bitcoin Ivy

Bitcoin Ivy allows you to write contracts that secure Bitcoin using arbitrary combinations of conditions supported by Bitcoin Script.

Each contract has one or more clauses. You only need to satisfy one of a contract’s clauses to unlock its value. Once a contract has been satisfied, that contract is destroyed and its value is unlocked.

Each clause can list one or more conditions that must be satisfied. Supported conditions include:

* Requiring a signature corresponding to a prespecified public key (see LockWithPublicKey)

* Requiring M signatures corresponding to any of N prespecified public keys (see LockWithMultisig)

* Checking that the cryptographic hash of a string or public key is equal to a prespecified hash (see LockWithPublicKeyHash, RevealCollision, RevealPreimage)

* Waiting until after a specified block height or block time (see LockUntil, TransferWithTimeout)

* Waiting until the contract has been on the blockchain for longer than a specified duration (see LockDelay, EscrowWithDelay, VaultSpend)

Bitcoin Ivy is based on [Ivy](https://chain.com/docs/1.2/ivy-playground/docs), a smart contract language developed at [Chain](https://www.chain.com/). 

