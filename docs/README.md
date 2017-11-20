# Bitcoin Ivy

Bitcoin Ivy is a higher-level language for writing smart contracts for the Bitcoin protocol. It compiles to instructions for Bitcoin’s virtual machine, Bitcoin Script, and can be used to create SegWit-compatible Bitcoin addresses. It is an adaptation of Chain’s smart contract language, [Ivy](http://chain.com/ivy).

You can try out Bitcoin Ivy using the [Bitcoin Ivy Playground](https://d2w65k0ltszbq7.cloudfront.net/bitcoin), which allows you to create test contracts and try spending them, all in a sandboxed environment.

**Bitcoin Ivy is prototype software and is intended for educational purposes only**. Do not attempt to use Bitcoin Ivy to control real Bitcoins. The Bitcoin Ivy Playground and SDK do not currently support creating testnet or mainnet transactions, and if you try to use the generated scripts or addresses on the Bitcoin network, you risk losing access to your coins. Furthermore, the Playground is not built to be a secure wallet; it generates private keys and secret bytestrings using JavaScript and stores them insecurely in your browser’s local storage. Finally, the Bitcoin Ivy compiler is relatively untested prototype software, and we make no guarantees that the scripts produced will be bug-free. 

Bug reports, feature requests are welcome; you can create an [issue](https://github.com/ivy-lang/bitcoin-ivy/issues) or email [bugs@ivy-lang.com](mailto:bugs@ivy-lang.com).