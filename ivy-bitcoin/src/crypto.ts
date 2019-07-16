import { hd, KeyRing } from "bcoin"
import * as crypto from "bcrypto"

export const sha1 = crypto.sha1
export const sha256 = crypto.sha256
export const ripemd160 = crypto.ripemd160
export const secp256k1 = crypto.secp256k1
export const randomBytes = crypto.randomBytes
export const privateKey = hd.PrivateKey
export { KeyRing }