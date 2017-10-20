# How Bitcoin smart contracts work

Bitcoin Ivy is designed to make it easier to create smart contracts for the Bitcoin network. Bitcoin's protocol works very differently from other blockchain protocols that support smart contracts, such as Ethereum, and the types of contracts that are supported are more limited. Despite those limitations, Bitcoin smart contracts have proven to be surprisingly flexible, supporting applications such as payment channels, cross-chain atomic trades, and more. Future protocol upgrades—and improvements in tooling—may make it possible to build increasingly sophisticated applications on top of Bitcoin.

The below sections provide some background on how Bitcoin transactions, addresses, and scripting work, glossing over some important details. If you would like to learn about these topics, you can check out [Mastering Bitcoin](https://github.com/bitcoinbook/bitcoinbook), by Andreas Antonopoulos.

These explanations also assume that you are familiar with the basic concept of a distributed ledger, as well as digital signatures and hash functions. For more background on those concepts, you can check out [this introductory post](https://blog.chain.com/behind-the-magic-of-the-blockchain-48f1cb35f1dc) from the Chain blog.

## Bitcoin contracts

The primary responsibility of the Bitcoin network is to maintain a distributed ledger, meaning information about who controls each of the over 16 million (at the time of this writing) Bitcoins in existence.

You can think of the current state of the ledger as a set of lockboxes, each of which stores some value (i.e., 1000 BTC, 5 BTC, or .001 BTC) and is controlled by some [*address*](#bitcoin-addresses) (i.e., 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa).

In Bitcoin, these lockboxes are usually referred to as "unspent transaction outputs." In Bitcoin Ivy, we call them *contracts*.

## Bitcoin transactions

Each Bitcoin transaction unlocks value from some set of contracts (or creates new value from thin air, in the case of a [coinbase transaction](https://bitcoin.org/en/glossary/coinbase-transaction)), and locks that value into newly created contracts. The old contracts, once unlocked, are removed from the ledger state; there is no way to withdraw only part of the value from a contract, or change a contract's state. In other words, in Bitcoin, contracts are *immutable*.

A transaction contains a list of *inputs*—the unspent contracts that the transaction wants to unlock—and a list of *outputs*—the new contracts that the contract wants to create. The amount of value unlocked in the inputs must be equal to the amount of value locked in the outputs.

For more on Bitcoin transactions, you can check out Chapter 6 of Mastering Bitcoin, [Transactions](https://github.com/bitcoinbook/bitcoinbook/blob/second_edition/ch06.asciidoc).

## Bitcoin addresses

Bitcoin wouldn't provide much security if anyone were able to unlock any contract. Contracts can only be unlocked under certain conditions, specified in that contract's *address*. For example, an address can specify that the contract can only be unlocked using a digital signature from the contract's owner (or more specifically, by the private key corresponding to a prespecified public key).

Each Bitcoin address corresponds to a program.[^1] When you send Bitcoin to an address, you are creating a contract which locks that Bitcoin up with that address's program. The only way to spend that Bitcoin is to satisfy the program, thus unlocking the value and allowing it to be sent to a new address. 

When spending a contract, the user provides some arguments to satisfy the contract's program. For example, the arguments might include one or more signatures, or the preimage of a particular hash. In Bitcoin Ivy, these arguments are referred to as *clause arguments*, since they are provided at the time that a particular clause of the contract is invoked.

## Bitcoin Script

Bitcoin Script is the low-level language that contracts' programs are written in. It consists of a sequence of opcodes, which are executed in order by a stack-based virtual machine (after the provided clause arguments are first placed on the stack).

Bitcoin Script is a relatively simple language, with support for cryptographic and hash operations, as well as conditionals. It is not Turing-complete (since it has no support for looping or recursion). It also does not allow scripts to inspect other inputs or outputs in the transaction, meaning the contract cannot control the flow of value or maintain any kind of persistent state.[^2]

Developers already use Bitcoin Script to create multisignature Bitcoin addresses and time-locked transactions, as well as more complex protocols like payment channels and cross-chain atomic trades. But reading and writing programs using Bitcoin Script is difficult, as is using it to create addresses and transactions. The goal of Bitcoin Ivy is to make it easier to write and instantiate these programs.

For more on Bitcoin Script, you can check out the [Bitcoin Wiki](https://en.bitcoin.it/wiki/Script) as well as Chapter 7 of Mastering Bitcoin, [Advanced Transactions and Scripting](https://github.com/bitcoinbook/bitcoinbook/blob/second_edition/ch07.asciidoc)

[^1]: Conversion between Bitcoin Script programs and Bitcoin addresses involves some technical details that are beyond the scope of this documentation. The Bitcoin Ivy compiler creates *Segregated Witness* (SegWit) addresses, a new kind of Bitcoin address that has been supported since a protocol upgrade in August 2017. To create a SegWit address, the bytecode of the program—the "witness script"—is hashed to create a "redeem script," which is in turn hashed to create the address. To spend from a SegWit address, both the redeem script and the witness script are revealed, and arguments are provided to satisfy the witness script. For more on how SegWit addresses and scripts work, see the [Segregated Witness Wallet Development Guide](https://bitcoincore.org/en/segwit_wallet_dev/) from Bitcoin Core.

[^2]: The inability to directly control value is a major difference between Bitcoin Ivy and the version of [Ivy](https://www.chain.com/ivy) used to write smart contracts for Chain Core. There have been several proposals to add this kind of functionality to Bitcoin Script, most notably in [Bitcoin Covenants](http://fc16.ifca.ai/bitcoin/papers/MES16.pdf), by Malte Möser, Ittay Eyal, and Emin Gün Sirer.