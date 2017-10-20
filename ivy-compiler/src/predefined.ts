// Predefined contract templates

import { opcode as Opcode } from "bcoin"

export const DEMO_ID_LIST = [
  "LockWithPublicKey",
  "LockWithMultisig",
  "LockWithPublicKeyHash",
  "RevealPreimage",
  "RevealCollision",
  "LockUntil",
  "LockDelay",
  "TransferWithTimeout",
  "EscrowWithTimeout",
  "VaultSpend"
]

export const DEMO_CONTRACTS = {
  LockWithPublicKey: `contract LockWithPublicKey(publicKey: PublicKey, val: Value) {
  clause spend(sig: Signature) {
    verify checkSig(publicKey, sig)
    unlock val
  }
}`,
  LockWithMultisig: `contract LockWithMultisig(
  pubKey1: PublicKey,
  pubKey2: PublicKey,
  pubKey3: PublicKey,
  val: Value
) {
  clause spend(sig1: Signature, sig2: Signature) {
    verify checkMultiSig([pubKey1, pubKey2, pubKey3], [sig1, sig2])
    unlock val
  }
}`,
  LockWithPublicKeyHash: `contract LockWithPublicKeyHash(pubKeyHash: Sha256(PublicKey), val: Value) {
  clause spend(pubKey: PublicKey, sig: Signature) {
    verify sha256(pubKey) == pubKeyHash
    verify checkSig(pubKey, sig)
    unlock val
  }
}`,
  RevealPreimage: `contract RevealPreimage(hash: Sha256(Bytes), val: Value) {
  clause reveal(string: Bytes) {
    verify sha256(string) == hash
    unlock val
  }
}`,
  RevealCollision: `contract RevealCollision(val: Value) {
  clause reveal(string1: Bytes, string2: Bytes) {
    verify string1 != string2
    verify sha1(string1) == sha1(string2)
    unlock val
  }
}`,
  LockUntil: `contract LockUntil(publicKey: PublicKey, time: Time, val: Value) {
  clause spend(sig: Signature) {
    verify checkSig(publicKey, sig)
    verify after(time)
    unlock val
  }
}`,
  LockDelay: `contract LockDelay(publicKey: PublicKey, delay: Duration, val: Value) {
  clause spend(sig: Signature) {
    verify checkSig(publicKey, sig)
    verify older(delay)
    unlock val
  }
}`,
  TransferWithTimeout: `contract TransferWithTimeout(
  sender: PublicKey,
  recipient: PublicKey,
  timeout: Time,
  val: Value
) {
  clause transfer(senderSig: Signature, recipientSig: Signature) {
    verify checkSig(sender, senderSig)
    verify checkSig(recipient, recipientSig)
    unlock val
  }
  clause timeout(senderSig: Signature) {
    verify checkSig(sender, senderSig)
    verify after(timeout)
    unlock val
  }
}`,
  EscrowWithTimeout: `contract EscrowWithTimeout(
  sender: PublicKey,
  recipient: PublicKey,
  escrow: PublicKey,
  timeout: Time,
  val: Value
) {
  clause transfer(escrowSig: Signature, recipientSig: Signature) {
    verify checkSig(escrow, escrowSig)
    verify checkSig(recipient, recipientSig)
    unlock val
  }
  clause timeout(senderSig: Signature) {
    verify checkSig(sender, senderSig)
    verify after(timeout)
    unlock val
  }
}`,
  VaultSpend: `contract VaultSpend(
  hotKey: PublicKey,
  coldKey: PublicKey,
  delay: Duration,
  val: Value
) {
  clause cancel(sig: Signature) {
    verify checkSig(coldKey, sig)
    unlock val
  }
  clause complete(sig: Signature) {
    verify older(delay)
    verify checkSig(hotKey, sig)
    unlock val
  }
}`
}

const Bytes = Buffer.from(
  "5d019aa9ff5f77ae12458a14f161a9ac7c49b8cb41959f29e20f29811d47b81f",
  "hex"
)

const Sha256Bytes = Buffer.from(
  "7196633b1ce5bf5fa369169ea81fc03a8238b38a888ef226a1e1bb42ab186bcb",
  "hex"
)
const Sha1Bytes = Buffer.from("a88a129b1afa94547623f27d7c6e566a7d902f7c", "hex")
const Ripemd160Bytes = Buffer.from(
  "cbf33f6b1a8ddd0ba7960f639d703653d111b366",
  "hex"
)

const PublicKeyHash = Buffer.from(
  "67e403c30d6a2f5240bdd47b4d977c2c006f9639e80ccaf24547569f03729f60",
  "hex"
)

const PublicKeys = [
  Buffer.from(
    "0209087ba51d402d3f03fe6437ff273d972b3bba3659b6a0735a440c71059127c0",
    "hex"
  ),
  Buffer.from(
    "02e997d0f14c8adbb0637c5f8ab803cdfcfefc257c8e4b85c2d770d64b5b8f88f0",
    "hex"
  ),
  Buffer.from(
    "039a43418eb28a74b42dc8e94716ed1b0967276bd69ab7fe51647c58b762621f62",
    "hex"
  )
]

// const PrivateKeys = [ // just for reference
//   "Kyw8s2qf2TxNnJMwfrKYhAsZ6eAmMMhAv4Ej4VVE8KpVsDvXurJK",
//   "L3tiMe49mswHQKqrikqNxJpVZSiBU7bYs1tstuXEYnrvjqRYvWUE",
//   "KwFv55qQSs3ipb8Trh6EkYaUTNGNtx5qVx55LMqNvRrj69En5tzY"
// ]

export const TEST_CONTRACT_ARGS = {
  LockWithPublicKey: [PublicKeys[0], 0],
  LockWithMultisig: [...PublicKeys, 0],
  LockWithPublicKeyHash: [PublicKeyHash, 0],
  RevealPreimage: [Sha256Bytes, 0],
  RevealCollision: [0],
  LockUntil: [PublicKeys[0], 20, 0],
  LockDelay: [PublicKeys[0], 20, 0],
  TransferWithTimeout: [PublicKeys[0], PublicKeys[1], 20, 0],
  EscrowWithTimeout: [...PublicKeys, 20, 0],
  VaultSpend: [PublicKeys[0], PublicKeys[1], 20, 0],
  HashOperations: [Sha256Bytes, Sha1Bytes, Ripemd160Bytes, 0]
}

export const TEST_CONTRACT_CLAUSE_NAMES = {
  LockWithPublicKey: "spend",
  LockWithMultisig: "spend",
  LockWithPublicKeyHash: "spend",
  RevealPreimage: "reveal",
  RevealCollision: "reveal",
  LockUntil: "spend",
  LockDelay: "spend",
  TransferWithTimeout: "transfer",
  EscrowWithTimeout: "timeout",
  VaultSpend: "complete",
  HashOperations: "reveal"
}

export const TEST_CONTRACT_TIMES = {
  LockUntil: 20,
  EscrowWithTimeout: 20  
}

export const TEST_CONTRACT_AGES = {
  LockDelay: 20,
  VaultSpend: 20
}

export const TEST_SPEND_ARGUMENTS = {
  LockWithPublicKey: [
    "3045022100f07c2b971827ddb8a42fba5d33b6ab2d2aaeede3f9701e43d3103d79eb2c6af8022060e270bc75dddecc174fb04372cee9dead858ecd38ad700d28ab08c9618bb44b01"
  ],
  LockWithMultisig: [
    "3044022027e02641754f6e5d8e610b094bfff6a18c1259e79fe23388a187275650b6236b0220224d9170e5044cb91f5222ff0e05900a0c02786cdd82cf43922097c6b5c5ba8801",
    "3045022100dc5fa44d6129ded838ed3188aa1e2ff3d622a8545180ef29b5f32d073e7fc45302207fd1aa149379018c1d3715402db152d03243309c62ac89958ff35e7d12ff5a3b01"
  ],
  LockWithPublicKeyHash: [
    PublicKeys[0],
    "3045022100a6f4423172a0a4c79e409f4643172386e54f51f3052a636e1b9c3e45bc45dc6c02204f541ff5193494b3ef5f86fad0912b662477aae16c6a0fbe9a1875754665ff6a01"
  ],
  RevealPreimage: [Bytes],
  RevealCollision: [
    "255044462d312e330a25e2e3cfd30a0a0a312030206f626a0a3c3c2f57696474682032203020522f4865696768742033203020522f547970652034203020522f537562747970652035203020522f46696c7465722036203020522f436f6c6f7253706163652037203020522f4c656e6774682038203020522f42697473506572436f6d706f6e656e7420383e3e0a73747265616d0affd8fffe00245348412d3120697320646561642121212121852fec092339759c39b1a1c63c4c97e1fffe017f46dc93a6b67e013b029aaa1db2560b45ca67d688c7f84b8c4c791fe02b3df614f86db1690901c56b45c1530afedfb76038e972722fe7ad728f0e4904e046c230570fe9d41398abe12ef5bc942be33542a4802d98b5d70f2a332ec37fac3514e74ddc0f2cc1a874cd0c78305a21566461309789606bd0bf3f98cda8044629a1",
    "255044462d312e330a25e2e3cfd30a0a0a312030206f626a0a3c3c2f57696474682032203020522f4865696768742033203020522f547970652034203020522f537562747970652035203020522f46696c7465722036203020522f436f6c6f7253706163652037203020522f4c656e6774682038203020522f42697473506572436f6d706f6e656e7420383e3e0a73747265616d0affd8fffe00245348412d3120697320646561642121212121852fec092339759c39b1a1c63c4c97e1fffe017346dc9166b67e118f029ab621b2560ff9ca67cca8c7f85ba84c79030c2b3de218f86db3a90901d5df45c14f26fedfb3dc38e96ac22fe7bd728f0e45bce046d23c570feb141398bb552ef5a0a82be331fea48037b8b5d71f0e332edf93ac3500eb4ddc0decc1a864790c782c76215660dd309791d06bd0af3f98cda4bc4629b1"
  ],
  LockUntil: [
    "304502210083bf22a83f82d3eaac824eaf8832302355055d744e12e290692d5c1a6f191f250220348ce48f05b2670ce8c954d04f71005efe2cd9aa10a1010bb9047547f8305e2001"
  ],
  LockDelay: [
    "3044022076f2201970acba71067a3defa7aa2ac58c2e8cb2b1fd7bb49dc4a29fec0e55d20220384f85cee5598ecbcb6530634e8f1bc4d0098b6c99cb087964b47befe57ca7af01"
  ],
  TransferWithTimeout: [
    "304402207f47f0619e76293967c6a91864ddcfdad01dd17d56d0989e0bf2be2c08ab3ba502200a69fb6386a57fbed938683a0f1ee4973fcc89c5d2b1992ba90d252002d7c3fe01",
    "304402203cfdd4e55d7e11d95ca466f4d110d8054994b1ad42c4bd1567d553ed982859e102207b6332ce6e23b5fac755c1712f3396786b6f4512d82b4ca0d343d464eba106a001"
  ],
  EscrowWithTimeout: [
    "3045022100bb52beee7bfc24a94819397633d98ae8065bb2eb9461208edd0fbc435d464f99022067a337ab8c2b18762a9a8ec22c53d0eb639e6cd264ac39dc8519e03373f1470101"
  ],
  VaultSpend: [
    "30440220259d47913eb5c5ff625fb29cfe571632e1bd197e53026eb6db3f335b05be6efe022033f59f4f240a098d41304f35870bb54012ff5d29a6f0d9664b23779e295f998001"
  ],
  HashOperations: [Bytes]
}

export const TEST_CASES = {
  ...DEMO_CONTRACTS,
  HashOperations: `contract HashOperations(
  hash1: Sha256(Bytes),
  hash2: Sha1(Bytes),
  hash3: Ripemd160(Bytes),
  val: Value
) {
  clause reveal(preimage: Bytes) {
    verify sha256(preimage) == hash1
    verify sha1(preimage) == hash2
    verify ripemd160(preimage) == hash3
    unlock val
  }
}`
}

export const ERRORS = {
  "is missing a bracket": `contract LockWithPublicKey(publicKey: PublicKey, val: Value) {
  clause spend(sig: Signature)
    verify checkSig(publicKey, sig)
    unlock val
  }
}`,
  "is missing a type": `contract LockWithPublicKey(publicKey: PublicKey, val: Value) {
  clause spend(sig) {
    verify checkSig(publicKey, sig)
    unlock val
  }
}`,
  "uses an invalid operator": `contract LockWithPublicKey(publicKey: PublicKey, val: Value) {
  clause spend(sig: Signature) {
    verify 1 * 1 == 1
    unlock val
  }
}`,
  "has two clauses with the same name": `contract LockWithPublicKey(publicKey: PublicKey, val: Value) {
  clause spend(sig: Signature) {
    verify checkSig(publicKey, sig)
    unlock val
  }
  clause spend(sig: Signature) {
    verify checkSig(publicKey, sig)
    unlock val
  }
}`,
  "uses non-matching hash types": `contract LockWithPublicKeyHash(publicKeyHash: Sha256(PublicKey), val: Value) {
  clause spend(publicKey: PublicKey, sig: Signature) {
    verify sha1(publicKey) == publicKeyHash
    verify checkSig(publicKey, sig)
    unlock val
  }
}`,
  "has no Value parameter": `contract LockWithPublicKey(publicKey: PublicKey) {
  clause spend(sig: Signature) {
    verify checkSig(publicKey, sig)
  }
}`,
  "never unlocks its value": `contract LockWithPublicKey(publicKey: PublicKey, val: Value) {
  clause spend(sig: Signature) {
    verify checkSig(publicKey, sig)
  }
}`,
  "never unlocks its value in one clause": `contract LockWithPublicKey(publicKey: PublicKey, val: Value) {
  clause spend(sig: Signature) {
    verify checkSig(publicKey, sig)
  }
  clause spend2(sig: Signature) {
    verify checkSig(publicKey, sig)
    unlock val
  }
}`,
  "has two values": `contract LockWithPublicKey(publicKey: PublicKey, val1: Value, val2: Value) {
  clause spend(sig: Signature) {
    verify checkSig(publicKey, sig)
    unlock val1
    unlock val2
  }
}`,
  "has two values, unlocked in different clauses": `contract LockWithPublicKey(publicKey: PublicKey, val1: Value, val2: Value) {
  clause spend(sig: Signature) {
    verify checkSig(publicKey, sig)
    unlock val1
  }
  clause spend2(sig: Signature) {
    verify checkSig(publicKey, sig)
    unlock val2
  }
}`,
  "passes values of the wrong type to a function": `contract LockWithPublicKey(publicKey: PublicKey, val: Value) {
  clause spend(sig: Bytes) {
    verify checkSig(publicKey, sig)
    unlock val
  }
}`,
  "passes a value of the wrong type to verify": `contract LockWithPublicKey(val: Value) {
  clause spend() {
    verify 1 + 1
    unlock val
  }
}`,
  "does not use one of its contract parameters": `contract LockWithPublicKey(publicKey: PublicKey, val: Value) {
  clause spend() {
    unlock val
  }
}`,
  "does not use one of its clause parameters": `contract LockWithPublicKey(val: Value) {
  clause spend(sig: Signature) {
    unlock val
  }
}`
}
