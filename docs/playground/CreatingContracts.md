### Creating contracts

To create a contract in the playground, use the [Create Contract](https://ivy-lang.org/bitcoin/create) page.

![Load Template](/gitbook/images/LoadTemplate.png)

First, you have to select which contract template you want to use. Click the "Load Template" button and select the "LockWithPublicKey" template. (If this is your first time using the playground, the LockWithPublicKey template should already be loaded.)

![Contract Arguments](/gitbook/images/ContractArguments.png)

You must then provide the contract's parameters. First, you must provide a public key, **publicKey**. The playground allows you to generate a keypair, provide your own public key, or provide a private key. (Do not paste your real Bitcoin private key into the playground! Private keys are stored in the browser's local storage, which is potentially insecure.)

You also must provide the Value, **val**. This parameter represents the actual bitcoins that are being deposited into the contract. In the playground, you only create fake contracts with simulated value, so you just have to provide a number.

![Address](/gitbook/images/Address.png)

Once you've provided the arguments, you can see the generated testnet address, as well as the redeem script and witness script (or, in this special case, public key), which would be needed to spend the contract.

Finally, you can click "Create" to instantiate a contract in the playground. Again, this doesn't actually touch the Bitcoin network—it just creates a simulated contract in memory so you can see which arguments would allow you to spend it.