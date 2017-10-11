# JavaScript library

Bitcoin Ivy is also available as a (very unstable and early-stage) [JavaScript library](https://www.npmjs.com/package/bitcoin-ivy).

This library allows you to create transaction templates (using the `compileTemplate` function), as . It does not support creating real transactions (on either the testnet or mainnet).

```
npm install bitcoin-ivy
```

```
import {
  compileTemplate,
  fulfill,
  instantiate,
  spend,
  toSighash,
  createSignature,
  crypto
} from "bitcoin-ivy"

const source = `contract LockWithPublicKey(publicKey: PublicKey, val: Value) {
  clause spend(sig: Signature) {
    verify checkSig(publicKey, sig)
    unlock val
  }
}`
const privateKey = "Kyw8s2qf2TxNnJMwfrKYhAsZ6eAmMMhAv4Ej4VVE8KpVsDvXurJK"
const publicKey = crypto.fromSecret(privateKey).getPublicKey("hex")
const destinationAddress = ""
const amount = 0
const locktime = 0
const sequenceNumber = { sequence: 0, seconds: false }

// compile the template
const template = compileTemplate(source)

// instantiate it
const instantiated = instantiate(template, [publicKey, amount])

// you can get the testnet address
console.log(instantiated.testnetAddress)

// and the mainnet address
console.log(instantiated.mainnetAddress)

// create the spending transaction
const spendTransaction = spend(
  instantiated.fundingTransaction,
  destinationAddress,
  amount,
  locktime,
  sequenceNumber
)

// sign it
const sighash = toSighash(instantiated, spendTransaction)
const sig = createSignature(sighash, privateKey)

// add the arguments to make the script pass
const fulfilled = fulfill(instantiated, spendTransaction, [sig], "spend")

// throw an error if transaction is invalid
fulfilled.check()
```

For more examples of how to use the library, see the [tests](https://github.com/ivy-lang/bitcoin-ivy/blob/main/ivy-compiler/src/test/test.ts).
