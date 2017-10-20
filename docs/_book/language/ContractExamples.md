# Contract examples

Below are the contract examples currently included in Bitcoin Ivy.

## LockWithPublicKey

LockWithPublicKey creates a simple Bitcoin address. A public key is specified at the time the contract is created. To spend from the contract, the user must provide a signature on the spending transaction from that public key.

All addresses produced by the Bitcoin Ivy compiler are [SegWit addresses](https://bitcoincore.org/en/segwit_wallet_dev/). However, unlike the other contracts, which compile to Pay-To-Witness-Script-Hash addresses, LockWithPublicKey compiles to a Pay-To-Witness-Public-Key-Hash address, a special (slightly more efficient) format for addresses that are controlled by a single public key.

## LockWithMultiSig

LockWithMultiSig creates a multisig address. Three public keys are specified at the time the contract is created. To spend from the contract, the user must provide signatures on the spending transaction from two of the three public keys.

## LockWithPublicKeyHash

LockWithPublicKeyHash is similar to the [LockWithPublicKey](#LockWithPublicKey) contract, except instead of taking a public key as a contract argument, it takes the SHA256 hash of that public key. Then, when it is spent, it expects an additional argument, the public key. The public key is hashed and compared to the `pubKeyHash` contract argument before the signature is checked.

There is not much reason to use this contract, particularly since modern Bitcoin addresses only reveal a hash of their script anyway, so their contract arguments are never explicitly revealed. Indeed, the `publicKey` argument to the [LockWithPublicKey](#LockWithPublicKey) contract is hashed [four times](https://bitcoincore.org/en/segwit_wallet_dev/#creation-of-p2sh-p2wpkh-address) before it included in the generated address.

## RevealPreimage

RevealPreimage can be unlocked by providing the preimage for a prespecified SHA256 hash digest.

This contract is rarely useful, since unlike a signature, a hash preimage is not tied to a specific spending transaction. If you tried to spend this contract by revealing the preimage, there would be nothing to stop a miner who saw your transaction from replacing it with a transaction that uses that preimage to unlock the contract and spend it to themselves.

## RevealCollision

RevealCollision pays a reward to anyone who provides a SHA1 collision—two different bytestrings whose SHA1 hashes are equal.

Peter Todd used this script to [post a bounty](https://lists.linuxfoundation.org/pipermail/bitcoin-dev/2013-September/003253.html) on collisions for several hash functions. When a SHA1 collision was [found in February 2017](https://shattered.io/), someone used that collision to [claim the bounty](https://tradeblock.com/bitcoin/tx/8d31992805518fd62daa3bdd2a5c4fd2cd3054c9b3dca1d78055e9528cff6adc).

As with the [RevealPreimage](#RevealPreimage) contract, any attempt to spend this contract could potentially be sniped by miners.

## LockUntil

LockUntil is similar to [LockWithPublicKey](#LockWithPublicKey), but adds an additional condition known as a timelock—it can only be spent after a particular time has passed.

Absolute timelocks (which use the [nLockTime](https://en.bitcoin.it/wiki/NLockTime) field of the spending transaction and the [CHECKLOCKTIMEVERIFY](https://github.com/bitcoin/bips/blob/master/bip-0065.mediawiki) opcode) are useful for some applications built on top of Bitcoin smart contracts, such as payment channels and the Lightning Network.

## LockDelay

LockDelay is similar to [LockUntil](#LockUntil), but instead of an absolute timelock, it uses a relative timelock—it can only be spent a certain amount of time after the contract has been added to the blockchain.

Relative timelocks (which use the transaction input's [sequence number](https://github.com/bitcoin/bips/blob/master/bip-0068.mediawiki) [CHECKSEQUENCEVERIFY](https://github.com/bitcoin/bips/blob/master/bip-0112.mediawiki) opcode) enable additional features in some protocols built on top of Bitcoin smart contracts. For example, they allow payment channels to have infinite duration.

## TransferWithTimeout

TransferWithTimeout .

This contract can be used as an extremely primitive payment channel. 

## EscrowWithTimeout

## VaultSpend
