# Functions

The following functions and operators are available when compiling Ivy to Bitcoin Script:

* **checkSig(publicKey: PublicKey, sig: Signature) -> Boolean**: check that the signature **sig **is a valid signature on the spending transaction by the private key corresponding to **publicKey**. 

* **checkMultiSig(publicKeys: [PublicKey], sigs: [Signature]) -> Boolean**: check that each of the signatures in **sigs** is a valid signature on the spending transaction by the private key corresponding to one of the **publicKeys**. The signatures must be provided in the same order as their respective public keys.

* **after(time: Time) -> Boolean**: check that the current block time (or block height) is after **time**. This uses the transaction’s nLockTime field and the [CHECKLOCKTIMEVERIFY](https://github.com/bitcoin/bips/blob/master/bip-0065.mediawiki) instruction.

* **older(duration: Duration) -> Boolean**: check that the contract being spent has been on the blockchain for at least **duration** (w). This uses the input’s sequence number and the [CHECKSEQUENCEVERIFY](https://github.com/bitcoin/bips/blob/master/bip-0112.mediawiki) instruction.

* **sha256(preimage: (T: HashableType)) -> Sha256(T)**: compute the SHA-256 hash of **preimage**

* **sha1(preimage: (T: HashableType)) -> Sha1(T)**: compute the SHA-1 hash of **preimage**

* **ripemd160(preimage: (T: HashableType)) -> Ripemd160(T)**: compute the RIPEMD-160 hash of **preimage**

* **bytes(item: T) -> Bytes**: coerce `item` to a bytestring (of type Bytes). This function does not have any effect on the compiled output or on script execution (since the Bitcoin Script VM treats every item as a bytestring); it only affects typechecking. (This cannot be called on an item of type Value or Boolean.)

* **size(bytestring: Bytes) -> Number**: get the length of `bytestring` in bytes.

* **==**, **!=**: check equality of any two values of the same type. (Note: because of certain limitations of Bitcoin Script, using these operators on Booleans is not allowed.)

