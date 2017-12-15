### Unlocking contracts

Once you've created a contract in the playground, you can unlock it on the [Unlock](https://ivy-lang.org/unlock) page. 

This page shows you all your existing contracts, as well as showing you information about any contracts that you've previously created and unlocked. Find the contract you created and click the "Unlock" button next to it.

Now you can see all the information about your contract, including its template and the parameters you provided at the time you created it.

To spend this contract, you must call the **spend** clause and provide a signature, **sig**. 

In the playground, you can generate this signature by copying the private key used to generate the parameters. You can find this by scrolling up to the 

The contract then uses *checkSig* to confirm that **sig** is a valid signature on the spending transaction by the private key corresponding to **publicKey**. If this operation fails, the attempt to spend the contract fails as well. If it succeeds, **val** is unlocked.
