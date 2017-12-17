### Creating contracts

To create a contract in the playground, use the [Create Contract](https://ivy-lang.org/bitcoin/create) page.

![Load Template](/gitbook/images/LoadTemplate.png)

First, you have to select which contract template you want to use. Click the "Load Template" button and select the "TransferWithTimeout" template.

This contract, which can be spent by signatures from both parties, and by only one party after a timeout, [could be used to implement a payment channel](/bitcoin/language/ExampleContracts).

![Contract Arguments](/gitbook/images/ContractArguments.png)

You must then provide the contract's parameters. First, you must provide two public keys, one for the **sender** and one for the **recipient**. The playground allows you to generate a keypair, provide a public key, or provide a private key. (Do not paste your real Bitcoin private key into the playground! Private keys are stored in the browser's local storage, which is potentially insecure.) For this example, we'll generate two public keys.

You also need to provide a time, **timeout**, designating the time after which point the sender will be able to recover the deposited amount if the **recipient** has not accepted it. You can select either any block height (such as 500000), or any timestamp (such as 12/31/2017 12:00 PM).

Finally, you must provide the Value, **val**. This parameter represents the actual bitcoins that are being deposited into the contract. In the playground, you only create fake contracts with simulated value, so you just have to provide a number of simulated Bitcoins to lock up.

![Address](/gitbook/images/Address.png)

Once you've provided the arguments, you can see the generated testnet address, as well as the redeem script and witness script, which would be needed to spend the contract.

Finally, you can click "Create" to instantiate a contract in the playground. Again, this doesn't actually touch the Bitcoin network—it just creates a simulated contract in memory so you can see which arguments would allow you to spend it.