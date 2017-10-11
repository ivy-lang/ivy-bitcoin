# Bitcoin Script

Bitcoin Ivy compiles to Bitcoin Script, a low-level language used by the Bitcoin Protocol to validate transactions. Each address in Bitcoin actually 

Developers already use Bitcoin Script to create multisignature Bitcoin addresses and time-locked transactions, as well as more complex protocols like payment channels and cross-chain atomic trades. Bitcoin Ivy aims to make it easier to design and instantiate these scripts.

Bitcoin Script is a relatively simple language, with support for cryptographic and hash operations, as well as conditionals. It is not Turing-complete (since it has no support for looping or recursion), and does not allow scripts to require that value be sent to a particular address (i.e., [covenants](http://fc16.ifca.ai/bitcoin/papers/MES16.pdf)).

For more on Bitcoin Script, you can check out the [Bitcoin Wiki](https://en.bitcoin.it/wiki/Script) and the [Advanced Transactions and Scripting](https://github.com/bitcoinbook/bitcoinbook/blob/second_edition/ch07.asciidoc) chapter from Mastering Bitcoin, by Andreas Antonopoulos.

### Segregated Witness

The Bitcoin Ivy compiler creates *Segregated Witness* (SegWit) addresses. For more on how SegWit addresses and scripts work, see the [Segregated Witness Wallet Development Guide](https://bitcoincore.org/en/segwit_wallet_dev/) from Bitcoin Core.
