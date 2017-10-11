# Creating contracts

Here’s an illustration of creating and spending the LockWithPublicKey contract.

The LockWithPublicKey contract works like a typical Bitcoin address (in fact, the generated address is indistinguishable from a normal SegWit testnet address). To create it, you provide a public key, and some Bitcoin. To unlock the contract, you can sign the spending transaction with the private key that corresponds to tat public key.

To create the contract, you provide a public key, **publicKey**, and fund the contract with some Bitcoins, **val**. The playground allows you to generate a keypair, or provide your own public or private key. (For security, do not paste your real Bitcoin private key into the playground!) The Bitcoins represented by **val** are locked up until the contract is spent.

Note: unlike the other contracts, which compile to Pay-To-Witness-Script-Hash addresses, this contract compiles to a Pay-To-Witness-Public-Key-Hash address, a special format for addresses that are controlled by a single public key.
