import { crypto, hd, keyring } from "bcoin"

export const sha1 = crypto.sha1
export const sha256 = crypto.sha256
export const ripemd160 = crypto.ripemd160
export const sign = crypto.secp256k1.sign
export const fromDER = crypto.secp256k1.fromDER
export const randomBytes = crypto.randomBytes
export const privateKey = hd.PrivateKey
export const fromSecret = keyring.fromSecret
export const fromPublic = keyring.fromPublic
export const fromPrivate = keyring.fromPrivate
