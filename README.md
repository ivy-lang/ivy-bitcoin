# Bitcoin Ivy

Bitcoin Ivy is a higher-level language for writing smart contracts for the Bitcoin protocol. It compiles to instructions for Bitcoin’s virtual machine, Bitcoin Script, and can be used to create SegWit-compatible Bitcoin addresses. It is an adaptation of Chain’s smart contract language, [Ivy](http://chain.com/ivy).

You can try out Bitcoin Ivy using the [Bitcoin Ivy Playground](http://d2w65k0ltszbq7.cloudfront.net/bitcoin) [TODO: update with final URL], which allows you to create test contracts and try spending them, in a sandboxed environment.

**Bitcoin Ivy is prototype software and is intended for educational purposes only**. Do not use Bitcoin Ivy or the Bitcoin Ivy playground to control real Bitcoins. 

Bug reports, feature requests are welcome; you can create an issue or email [ivy@chain.com](mailto:ivy@chain.com) [TODO: update with final email address].

## FAQs

**What can I do with Bitcoin Ivy?**

Bitcoin Ivy contracts can check signatures, compute hashes, and compute and enforce both absolute and relative timelocks. These conditions can be combined into clauses to support sophisticated logic. 

For more on what Bitcoin Ivy can do, see the [language documentation](#Language-documentation).

**What is Bitcoin Script?**

[Bitcoin Script](http://chimera.labs.oreilly.com/books/1234000001802/ch05.html#tx_script_language) is a low-level language used by the Bitcoin protocol to validate transactions. Developers use Bitcoin Script to create multisignature Bitcoin addresses and time-locked transactions, as well as more complex protocols like payment channels and cross-chain atomic trades.

Bitcoin Script is a relatively simple language, with support for cryptographic and hash operations, as well as conditionals. It is not Turing-complete (since it has no support for looping or recursion), and does not allow scripts to require that value be sent to a particular address (i.e., [covenants](http://fc16.ifca.ai/bitcoin/papers/MES16.pdf)).

**What is the Bitcoin Ivy Playground?**

The Bitcoin Ivy Playground is a developer tool for trying out Bitcoin Ivy. It allows you to write contract templates, generate corresponding Bitcoin testnet addresses, and simulate the creation of contracts in a sandboxed environment, and try spending those contracts with different arguments. It does not currently allow you to create or spend contracts on the Bitcoin testnet or mainnet.

**Should I use Bitcoin Ivy to store actual Bitcoin?**

*No*. The Bitcoin Ivy playground is intended for educational purposes only. It does not currently support creating testnet or mainnet transactions, and if you try to use the generated scripts on the testnet or mainnet, you risk losing access to your coins. Furthermore, the playground is not built to be a secure wallet; it generates private keys and secret bytestrings using JavaScript and stores them insecurely in your browser’s local storage. Additionally, the Bitcoin Ivy compiler is relatively untested prototype software, and we make no guarantees that the scripts produced will be bug-free. 

**How do I use the Bitcoin Ivy playground?**

Here’s an illustration of creating and spending the LockWithPublicKey contract.

The LockWithPublicKey contract works like a typical Bitcoin address (in fact, the generated address is indistinguishable from a normal SegWit testnet address). To create it, you provide a public key, and some Bitcoin. To unlock the contract, you can sign the spending transaction with the private key that corresponds to tat public key.

To create the contract, you provide a public key, **publicKey**, and fund the contract with some Bitcoins, **val**. The playground allows you to generate a keypair, or provide your own public or private key. (For security, do not paste your real Bitcoin private key into the playground!) The Bitcoins represented by **val** are locked up until the contract is spent.

To unlock value from the contract, you must call the **spend** clause and provide a signature, **sig**. In the playground, you can generate this signature by pasting in a private key. The contract then uses *checkSig* to confirm that **sig** is a valid signature on the spending transaction by the private key corresponding to **publicKey**. If this operation fails, the attempt to spend the contract fails as well. If it succeeds, **val** is unlocked.

Note: unlike the other contracts, which compile to Pay-To-Witness-Script-Hash addresses, this contract compiles to a Pay-To-Witness-Public-Key-Hash address, a special format for addresses that are controlled by a single public key.

**How can I install and use Bitcoin Ivy?**

Bitcoin Ivy is also available as a (very unstable and early-stage) [JavaScript library](https://www.npmjs.com/package/bitcoin-ivy).

```
npm install bitcoin-ivy
```

For examples of usage, see the [tests](/ivy-compiler/src/test/test.ts).

## Language documentation

Bitcoin Ivy allows you to write contracts that secure Bitcoin using arbitrary combinations of conditions supported by Bitcoin Script.

Each contract has one or more clauses. You only need to satisfy one of a contract’s clauses to unlock its value. Once a contract has been satisfied, that contract is destroyed and its value is unlocked.

Each clause can list one or more conditions that must be satisfied. Supported conditions include:

* Requiring a signature corresponding to a prespecified public key (see LockWithPublicKey)

* Requiring M signatures corresponding to any of N prespecified public keys (see LockWithMultisig)

* Checking that the cryptographic hash of a string or public key is equal to a prespecified hash (see LockWithPublicKeyHash, RevealCollision, RevealPreimage)

* Waiting until after a specified block height or block time (see LockUntil, TransferWithTimeout)

* Waiting until the contract has been on the blockchain for longer than a specified duration (see LockDelay, EscrowWithDelay, VaultSpend)

## Ivy Types

* **Bytes**: a string of bytes (typically represented in hexadecimal)

* **PublicKey**: an ECDSA public key

* **Signature**: a ECDSA signature by some private key on the h

* **Time**: a time (either a block height or a timestamp)

* **Duration**: a duration (either a number of blocks or a multiple of 512 seconds)

* **Boolean**: either **true** or **false**

* **HashableType**: any type which can be passed to hash functions: **Bytes**,** PublicKey**,** Sha256(T)**,** Sha1(T)**, and** Ripemd160(T)**.

* **Sha256(T: HashableType)**: the result of taking a [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hash of a value of the hashable type T.

* **Sha1(T: HashableType)**: the result of taking a [SHA-1](https://en.wikipedia.org/wiki/SHA-1) hash of a value of the hashable type T.

* **Ripemd160(T: HashableType)**: the result of taking a [RIPEMD-160](https://en.wikipedia.org/wiki/RIPEMD) hash of a value of the hashable type T.

## Ivy Functions

* **checkSig(publicKey: PublicKey, sig: Signature) -> Boolean**: check that the signature **sig **is a valid signature on the spending transaction by the private key corresponding to **publicKey**. 

* **checkMultiSig(publicKeys: [PublicKey], sigs: [Signature]) -> Boolean**: check that each of the signatures in **sigs** is a valid signature on the spending transaction by the private key corresponding to one of the **publicKeys**. The signatures must be provided in the same order as their respective public keys.

* **after(time: Time) -> Boolean**: check that the current block time (or block height) is after **time**. This uses the transaction’s nLockTime field and the [CHECKLOCKTIMEVERIFY](https://github.com/bitcoin/bips/blob/master/bip-0065.mediawiki) instruction.

* **older(duration: Duration) -> Boolean**: check that the contract being spent has been on the blockchain for at least **duration** (w). This uses the input’s sequence number and the [CHECKSEQUENCEVERIFY](https://github.com/bitcoin/bips/blob/master/bip-0112.mediawiki) instruction.

* **sha256(preimage: (T: HashableType)) -> Sha256(T)**: compute the SHA-256 hash of **preimage**

* **sha1(preimage: (T: HashableType)) -> Sha1(T)**: compute the SHA-1 hash of **preimage**

* **ripemd160(preimage: (T: HashableType)) -> Ripemd160(T)**: compute the RIPEMD-160 hash of **preimage**

* **==, !=**: check equality of any two values of the same type. (Note: because of certain limitations of Bitcoin Script, using these operators on Booleans is not allowed.)

## Further Reading

Bitcoin Ivy is based on [Ivy](https://chain.com/docs/1.2/ivy-playground/docs), a smart contract language developed at [Chain](https://www.chain.com/). 

For more on Bitcoin Script, you can check out the [Bitcoin Wiki](https://en.bitcoin.it/wiki/Script) and the [Advanced Transactions and Scripting](https://github.com/bitcoinbook/bitcoinbook/blob/second_edition/ch07.asciidoc) chapter from Mastering Bitcoin, by Andreas Antonopoulos.

For more on how SegWit addresses and scripts work, see the [Segregated Witness Wallet Development Guide](https://bitcoincore.org/en/segwit_wallet_dev/) from Bitcoin Core.

