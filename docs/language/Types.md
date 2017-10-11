# Types

* **Bytes**: a string of bytes (typically represented in hexadecimal)

* **PublicKey**: an ECDSA public key

* **Signature**: a ECDSA signature by some private key on the hash of the transaction

* **Time**: a time (either a block height or a timestamp)

* **Duration**: a duration (either a number of blocks or a multiple of 512 seconds)

* **Boolean**: either **true** or **false**

* **HashableType**: any type which can be passed to hash functions: **Bytes**, **PublicKey**, **Sha256(T)**, **Sha1(T)**, and **Ripemd160(T)**.

* **Sha256(T: HashableType)**: the result of taking a [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hash of a value of the hashable type T.

* **Sha1(T: HashableType)**: the result of taking a [SHA-1](https://en.wikipedia.org/wiki/SHA-1) hash of a value of the hashable type T.

* **Ripemd160(T: HashableType)**: the result of taking a [RIPEMD-160](https://en.wikipedia.org/wiki/RIPEMD) hash of a value of the hashable type T.
