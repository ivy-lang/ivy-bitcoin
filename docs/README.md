# Ivy

Ivy is a higher-level language that allows you to write smart contracts for the Bitcoin protocol. It can compile to instructions for Bitcoin’s virtual machine, Bitcoin Script, and can be used to create SegWit-compatible Bitcoin addresses. Ivy was developed at [Chain](https://chain.com).

You can try out Ivy using the [Ivy Playground for Bitcoin](https://ivylang.org/bitcoin), which allows you to create test contracts and try spending them, all in a sandboxed environment.

You can see the source code for these projects on [GitHub](https://github.com/ivy-lang/ivy-bitcoin).

**Ivy is prototype software and is intended for educational purposes only**. Do not attempt to use Ivy to control real Bitcoins. The Ivy Playground and SDK do not currently support creating testnet or mainnet transactions, and if you try to use the generated scripts or addresses on the Bitcoin network, you risk losing access to your coins. Furthermore, the Playground is not built to be a secure wallet; it generates private keys and secret bytestrings using JavaScript and stores them insecurely in your browser’s local storage. Finally, the Ivy compiler is relatively untested, and we make no guarantees that the scripts produced will be bug-free. 

Bug reports and feature requests are welcome; you can create an [issue](https://github.com/ivy-lang/ivy-bitcoin/issues) or [pull request](https://github.com/ivy-lang/ivy-bitcoin/pulls).