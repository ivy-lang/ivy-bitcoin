# Example Contracts

Below are some examples of contract templates written in Ivy. You can try out these contracts in the playground, where they are preloaded as default templates.

* [LockWithPublicKey](#lockwithpublickey)
* [LockWithMultiSig](#lockwithmultisig)
* [LockWithPublicKeyHash](#lockwithpublickeyhash)
* [RevealPreimage](#revealpreimage)
* [RevealCollision](#revealcollision)
* [RevealFixedPoint](#revealfixedpoint)
* [LockUntil](#lockuntil)
* [LockDelay](#lockdelay)
* [TransferWithTimeout](#transferwithtimeout)
* [ToLocal](#tolocal)
* [EscrowWithDelay](#escrowwithdelay)
* [VaultSpend](#vaultspend)
* [HTLC](#htlc)

These contracts demonstrate the following conditions supported by Bitcoin Script:

* Requiring a signature corresponding to a prespecified public key (see [LockWithPublicKey](#lockwithpublickey))

* Requiring M signatures corresponding to any of N prespecified public keys (see [LockWithMultisig](#lockwithmultisig))

* Checking that the cryptographic hash of a string or public key is equal to a prespecified hash (see [LockWithPublicKeyHash](#lockwithpublickeyhash), [RevealCollision](#revealcollision), [RevealPreimage](#revealpreimage), [RevealFixedPoint](#revealfixedpoint))

* Waiting until after a specified block height or block time (see [LockUntil](#lockuntil), [TransferWithTimeout](#transferwithtimeout))

* Waiting until the contract has been on the blockchain for longer than a specified duration (see [LockDelay](#lockdelay), [EscrowWithDelay](#escrowwithdelay), [VaultSpend](#vaultspend))



## LockWithPublicKey

```
contract LockWithPublicKey(publicKey: PublicKey, val: Value) {
  clause spend(sig: Signature) {
    verify checkSig(publicKey, sig)
    unlock val
  }
}
```

LockWithPublicKey creates a simple Bitcoin address. A public key is specified at the time the contract is created. To spend from the contract, the user must provide a signature on the spending transaction from that public key.

All Bitcoin addresses produced by the Ivy compiler are [SegWit addresses](https://bitcoincore.org/en/segwit_wallet_dev/). However, unlike the other contracts, which compile to Pay-To-Witness-Script-Hash addresses, LockWithPublicKey compiles to a Pay-To-Witness-Public-Key-Hash address, a special (slightly more efficient) format for addresses that are controlled by a single public key.

## LockWithMultiSig

```
contract LockWithMultisig(
  pubKey1: PublicKey,
  pubKey2: PublicKey,
  pubKey3: PublicKey,
  val: Value
) {
  clause spend(sig1: Signature, sig2: Signature) {
    verify checkMultiSig([pubKey1, pubKey2, pubKey3], [sig1, sig2])
    unlock val
  }
}
```

LockWithMultiSig creates a multisig address. Three public keys are specified at the time the contract is created. To spend from the contract, the user must provide signatures on the spending transaction from two of the three public keys.

## LockWithPublicKeyHash

```
contract LockWithPublicKeyHash(pubKeyHash: Sha256(PublicKey), val: Value) {
  clause spend(pubKey: PublicKey, sig: Signature) {
    verify sha256(pubKey) == pubKeyHash
    verify checkSig(pubKey, sig)
    unlock val
  }
}
```

LockWithPublicKeyHash is similar to the [LockWithPublicKey](#lockwithpublickey) contract, except instead of taking a public key as a contract argument, it takes the SHA256 hash of that public key. Then, when it is spent, it expects an additional argument, the public key. The public key is hashed and compared to the `pubKeyHash` contract argument before the signature is checked.

There is not much reason to use this contract, particularly since modern Bitcoin addresses only reveal a hash of their script anyway, so their contract arguments are never explicitly revealed. Indeed, the `publicKey` argument to the [LockWithPublicKey](#lockwithpublickey) contract is hashed [four times](https://bitcoincore.org/en/segwit_wallet_dev/#creation-of-p2sh-p2wpkh-address) before it included in the generated address.

## RevealPreimage

```
contract RevealPreimage(hash: Sha256(Bytes), val: Value) {
  clause reveal(string: Bytes) {
    verify sha256(string) == hash
    unlock val
  }
}
```

RevealPreimage can be unlocked by providing the preimage for a prespecified SHA256 hash digest.

This contract is typically not useful, since unlike a signature, a hash preimage is not tied to a specific spending transaction. If you tried to spend this contract by revealing the preimage, there would be nothing to stop a miner who saw your transaction from replacing it with a transaction that uses that preimage to unlock the contract and spend it to themselves.

## RevealCollision

```
contract RevealCollision(val: Value) {
  clause reveal(string1: Bytes, string2: Bytes) {
    verify string1 != string2
    verify sha1(string1) == sha1(string2)
    unlock val
  }
}
```

RevealCollision pays a reward to anyone who provides a SHA1 collision—two different bytestrings whose SHA1 hashes are equal.

Peter Todd used this script to [post a bounty](https://lists.linuxfoundation.org/pipermail/bitcoin-dev/2013-September/003253.html) on collisions for several hash functions. When a SHA1 collision was [found in February 2017](https://shattered.io/), someone used that collision to [claim the bounty](https://tradeblock.com/bitcoin/tx/8d31992805518fd62daa3bdd2a5c4fd2cd3054c9b3dca1d78055e9528cff6adc).

As with the [RevealPreimage](#revealpreimage) contract, any attempt to spend this contract could potentially be sniped by miners.

## RevealFixedPoint

```
contract RevealFixedPoint(val: Value) {
  clause reveal(hash: Bytes) {
    verify bytes(sha256(hash)) == hash
    unlock val
  }
}
```

RevealFixedPoint is similar to [RevealCollision](#revealcollision), except the challenge is to reveal a SHA256 [fixed point](https://en.wikipedia.org/wiki/One-way_compression_function#cite_ref-8), rather than a SHA1 collision.

In order to compare a SHA256 hash with its preimage, the former needs to be coerced to a bytestring, using the `bytes` function. This has no effect on script execution, but prevents the typechecker from objecting to the comparison.

## LockUntil

```
contract LockUntil(publicKey: PublicKey, time: Time, val: Value) {
  clause spend(sig: Signature) {
    verify checkSig(publicKey, sig)
    verify after(time)
    unlock val
  }
}
```

LockUntil is similar to [LockWithPublicKey](#lockwithpublickey), but adds an additional condition known as a timelock—it can only be spent after a particular time has passed.

Absolute timelocks (which use the [nLockTime](https://en.bitcoin.it/wiki/NLockTime) field of the spending transaction and the [CHECKLOCKTIMEVERIFY](https://github.com/bitcoin/bips/blob/master/bip-0065.mediawiki) opcode) can be used to prevent yourself from withdrawing Bitcoin before a certain time. They are also useful for some more sophisticated applications, such as [escrow](#escrowwithdelay) or [payment channels](#transferwithtimeout).

## LockDelay

```
contract LockDelay(publicKey: PublicKey, delay: Duration, val: Value) {
  clause spend(sig: Signature) {
    verify checkSig(publicKey, sig)
    verify older(delay)
    unlock val
  }
}
```

LockDelay is similar to [LockUntil](#lockuntil), but instead of an absolute timelock, it uses a relative timelock—it can only be spent a certain amount of time after the contract has been added to the blockchain.

Relative timelocks (which use the transaction input's [sequence number](https://github.com/bitcoin/bips/blob/master/bip-0068.mediawiki) [CHECKSEQUENCEVERIFY](https://github.com/bitcoin/bips/blob/master/bip-0112.mediawiki) opcode) can be more convenient than absolute locktimes, but they can also enable some powerful additional features in protocols such as payment channels.

## TransferWithTimeout

```
contract TransferWithTimeout(
  sender: PublicKey,
  recipient: PublicKey,
  timeout: Time,
  val: Value
) {
  clause transfer(senderSig: Signature, recipientSig: Signature) {
    verify checkSig(sender, senderSig)
    verify checkSig(recipient, recipientSig)
    unlock val
  }
  clause timeout(senderSig: Signature) {
    verify checkSig(sender, senderSig)
    verify after(timeout)
    unlock val
  }
}
```

TransferWithTimeout is our first example that has more than one clause. To satisfy such a contract, you only need to satisfy *one* of the clauses.

This contract is instantiated with two public keys, corresponding to the "sender" and the "recipient" of some transfer. The contract can be spent by the mutual agreement of both parties.

This contract could be used to create a primitive one-way payment channel. Suppose Alice wants to make a series of micropayments to Bob (for example, because she is browsing a publication owned by Bob, or watching a movie that she is paying for by the minute), but doesn't want to pay a transaction fee for every one of them.

Alice can prefund this TransferWithTimeOut contract with 10 BTC, using her own public key as the `sender` and Bob's key as the `recipient`. She can then create a transaction that sends some small portion of the contract—say, .00001 BTC—to Bob, but sends the rest back to herself. She signs that transaction and sends it to Bob (but doesn't send it to the blockchain). Bob only needs to add his signature to claim his .00001 BTC, but he can also wait for further payments. 

Alice can then send additional micropayments on this channel by creating new transactions that spend the same contract but send increasing amounts to Bob. Whenever Bob wants to close the channel, he signs and publishes only the *last* of those transactions, which sends Alice's total payment to him and returns the remaining change to her.

What happens if Bob disappears, or refuses to sign any transactions? That's what the `timeout` clause is for. After the channel's expiration time, Alice can call the `timeout` clause to reclaim all of the Bitcoin she used to prefund the channel. This prevents Alice's money from being locked up forever if Bob refuses to cooperate.

## ToLocal

This contract can be used as part of a bidirectional payment channel similar to those used in the Lightning Network, as described [here](https://github.com/lightningnetwork/lightning-rfc/blob/master/03-transactions.md#to_local-output). This contract would be used as an output of a commitment transaction (which represents a state that the parties agree to off-chain).

It is similar to the previous contract because it includes a timeout clause (the last one) with a single signature. However, this timeout is not for the depositor of the funds to claim them in case the other party is not cooperative, but is a time window left open for any disputes to be presented after one party tries to close the channel. Such a dispute can arise if the party that sent the on-chain transaction to close the channel is trying to propagate a state of the channel which is not valid anymore (as it might have been invalidated by subsequent off-chain transactions). In such a case, the party that didn't attempt to close the channel has this timeout available to withdraw all the funds in a punishment transaction, using the revocation private key that she learned when the channel state was invalidated.

```
contract ToLocal(
  localDelayedPubKey: PublicKey,
  revocationPubKey: PublicKey,
  toSelfDelay: Duration,
  val: Value
) {
  clause reveal(revocationSig: Signature) {
    verify checkSig(revocationPubKey, revocationSig)
    unlock val
  }
  clause timeout(localDelayedSig: Signature) {
    verify checkSig(localDelayedPubKey, localDelayedSig)
    verify older(toSelfDelay)
    unlock val
  }
}
```

## EscrowWithDelay

```
contract EscrowWithDelay(
  sender: PublicKey,
  recipient: PublicKey,
  escrow: PublicKey,
  delay: Duration,
  val: Value
) {
  clause transfer(sig1: Signature, sig2: Signature) {
    verify checkMultiSig(
      [sender, recipient, escrow], 
      [sig1, sig2]
    )
    unlock val
  }
  clause timeout(sig: Signature) {
    verify checkSig(sender, sig)
    verify older(delay)
    unlock val
  }
}
```

EscrowWithDelay implements a simple escrow contract. When it is instantiated, three keys are specified—one for the `sender` of the transfer, one for the `recipient`, and one for an `escrow` agent.

The escrow agent can approve or cancel the transfer with the cooperation of one of the other parties, but cannot steal the money for himself.

If the escrow agent and recipient both fail to cooperate, then after the expiration time, the sender is able to cancel the transfer and recover the money with the `timeout` clause.

You can imagine variants of this contract that, for example, give the `recipient` the funds in the event of a timeout instead of the `sender`.

## VaultSpend

```
contract VaultSpend(
  hotKey: PublicKey,
  coldKey: PublicKey,
  delay: Duration,
  val: Value
) {
  clause cancel(sig: Signature) {
    verify checkSig(coldKey, sig)
    unlock val
  }
  clause complete(sig: Signature) {
    verify older(delay)
    verify checkSig(hotKey, sig)
    unlock val
  }
}
```

VaultSpend implements a simple form of [*vault*](http://fc16.ifca.ai/bitcoin/papers/MES16.pdf), a mechanism for securing Bitcoin held in cold storage.

This contract is instantiated with two public keys: a `hotKey` and a `coldKey`. The "hot key" could be kept on a computer or server; the "cold key"—or "cancellation key"—would be kept somewhere offline and hard to get to, such as a paper wallet in a safety deposit box.

You would not actually store your funds in *this* contract. Instead, you could hold funds in a LockWithPublicKey contract secured by `coldKey`, and then _presign_ a transaction that spends it into this contract. You could keep the presigned transaction on the same server as the hot key. 

To withdraw the funds, you could use the presigned transaction to move them into this contract. After the `delay` has passed, you could then use the hot key to move the funds wherever you want to send them.

If an attacker compromises your server and steals the presigned transaction and hot key, they would only be able to move the money into this contract. The time delay would then give you enough time to notice, retrieve your cold key, and move the money to a safer contract.

The [initial design](http://fc16.ifca.ai/bitcoin/papers/MES16.pdf) for vaults by Möser, Eyal, and Sirer depended on a feature, covenants, that is not yet supported in Bitcoin Script. The implementation of vaults described above makes use of only existing Bitcoin Script features, but has some key limitations. Most importantly, an attacker who surreptitiously steals the hot key could wait for the owner to attempt a hot-key withdrawal, then, after the delay has expired, spend the transaction before the owner is able to. Until Bitcoin adds support for covenants (if ever), it may not be possible to fully implement a vault.

## HTLC

```
contract HTLC(
  sender: PublicKey, 
  recipient: PublicKey,
  expiration: Time,
  hash: Sha256(Bytes),
  val: Value
) {
  clause complete(preimage: Bytes, sig: Signature) {
    verify sha256(preimage) == hash
    verify checkSig(recipient, sig)
    unlock val
  }
  clause cancel(sig: Signature) {
    verify after(expiration)
    verify checkSig(sender, sig)
    unlock val
  }
}
```

HTLC is an implementation of a Hashed Timelock Contract, a construction that can be used to enable trustless exchanges of cryptocurrencies on completely different blockchain networks (such as trading Bitcoin for Ether), as well as multihop payments on payment channel networks such as the Lightning Network.

Before an HTLC is created, one party, the `recipient`, generates a secret `preimage`, hashes it, and provides the hash, `hash`, to the other party, `sender`.

In the normal case, an HTLC can be completed by the `recipient`, by revealing the `preimage`, which allows them to receive the locked value. If they do not, the `sender` can cancel the HTLC after a predefined `expiration` time, recovering the locked value.

A single HTLC is not useful by itself—it is simply a construction that promises to reward a particular recipient for revealing a preimage before a particular time, which is a fairly esoteric challenge.

The power comes when you have  _two_ HTLCs that use the same preimage, and which have staggered timeouts (so that a preimage that is revealed to complete the earlier-timeout HTLC can be used to complete the later-timeout HTLC). This allows parties to set up HTLCs so that both parties can be assured that either both HTLCs will complete, or neither will.

This assurance, _atomicity_, is easy to achieve when both operations are occurring on the same ledger—you can just include both operations in a single atomic transaction. But HTLCs allow you to enforce atomicity of transactions across _multiple ledgers_, which do not need to know anything about each other (though they do each need to support hash locks and time locks.)

These two ledgers can be separate blockchains, such as the Bitcoin and Ethereum networks, which means HTLCs can be used to make trustless trades of cryptocurrencies on different blockchains.

Alternatively, the two ledgers can be two different Bitcoin _payment channels_—off-chain bilateral ledgers which can be settled trustlessly to the main chain. (A simple payment channel is described [above](#transferwithtimeout).) This is how the Lightning Network allows multihop payments across a chain of payment channels.

Suppose Alice has a payment channel with Bob, and Bob has a payment channel with Charlie. If Alice wants to make a payment to Charlie over these channels, she can make a payment to Bob, and then Bob could make a payment to Charlie. However, how do Alice and Charlie guarantee that Bob won't cheat them, by receiving the payment from Alice but then neglecting to pay?

Lightning solves this problems using HTLCs. Specifically, the parties embed HTLCs _within_ each of their payment channels. Charlie, as the ultimate recipient, generates a `hash`. Alice and Bob create an HTLC in their payment channel, then Bob and Charlie create an HTLC in their payment channel, using the same hash. Once both HTLCs are created, Charlie can reveal the preimage to complete his HTLC, which means Bob will learn the preimage to complete his HTLC. The mechanics of embedding HTLCs within payment channels are very complex, and beyond the scope of this document, but the principle of each of the underlying HTLCs is essentially the same as in the one shown above.

You can also do atomic transactions between different combinations of ledgers, such as an atomic transaction between payment channels on different blockchains (which is what theoretically allows cross-blockchain payments on the Lightning Network), or an atomic transaction between a public ledger and a payment channel (known as a "[submarine swap](https://bitcoinmagazine.com/articles/pay-bitcoin-mainnet-lightning-and-back-submarine-swaps-are-now-live/)").
