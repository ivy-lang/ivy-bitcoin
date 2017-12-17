### Unlocking contracts

Once you've created a contract in the playground, you can unlock it on the [Unlock](https://ivy-lang.org/bitcoin/unlock) page. 

This page shows you all your existing contracts, as well as showing you information about any contracts that you've previously created and unlocked. Find the contract you created and click the "Unlock" button next to it.

Now you can see all the information about your contract, including its template and the parameters you provided at the time you created it.

To spend this contract, you must call one of its clauses, and provide the required arguments.

If you have approval of both the sender and the recipient, you can call the **transfer** clause.

![Transfer](/gitbook/images/Transfer.png)

In our case, we control both private keys, so we can just copy them from the fields shown in the Contract Arguments section and paste them into the necessary fields.

If the recipient disappears, the sender would have to wait until the timeout is complete, and then call the **timeout** clause.

![Timeout](/gitbook/images/Timeout.png)

To do this, you need to not only paste in the sender's private key to generate the signature, but need to also set the **Minimum Time** on the transaction (in the **Transaction Details** section) to be later than (or equal to) the locktime you set. Setting this field is needed to satisfy the contract, and the field, in turn, ensures that the spending transaction cannot be added to the blockchain until that time.

If either of these clauses is satisfied, the value can be unlocked. Click the **Unlock** button to do so.