# Ivy Language

Ivy is a smart contract language developed at [Chain](https://www.chain.com/) that now supports compilation to Bitcoin.

Ivy allows you to write contracts that secure Bitcoin using arbitrary combinations of conditions supported by Bitcoin Script.

Each contract has one or more clauses. You only need to satisfy one of a contract’s clauses to unlock its value. Once a contract has been satisfied, that contract is destroyed and its value is unlocked.

Each clause can list one or more conditions that must be satisfied. Supported conditions include:

* Requiring a signature corresponding to a prespecified public key (see [LockWithPublicKey](/language/ExampleContracts.html#lockwithpublickey))

* Requiring M signatures corresponding to any of N prespecified public keys (see [LockWithMultisig](/language/ExampleContracts.html#lockwithmultisig))

* Checking that the cryptographic hash of a string or public key is equal to a prespecified hash (see [LockWithPublicKeyHash](/language/ExampleContracts.html#lockwithpublickeyhash), [RevealCollision](/language/ExampleContracts.html#revealcollision), [RevealPreimage](/language/ExampleContracts.html#revealpreimage))

* Waiting until after a specified block height or block time (see [LockUntil](/language/ExampleContracts.html#lockuntil), [TransferWithTimeout](/language/ExampleContracts.html#transferwithtimeout)

* Waiting until the contract has been on the blockchain for longer than a specified duration (see [LockDelay](/language/ExampleContracts.html#lockdelay),  [EscrowWithDelay](/language/ExampleContracts.html#escrowwithdelay)), [VaultSpend](/language/ExampleContracts.html#vaultspend))

