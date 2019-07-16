import { hd, KeyRing } from "bcoin"
import * as crypto from "bcrypto"

export const sha1 = crypto.SHA1.digest
export const sha256 = crypto.SHA256.digest
export const ripemd160 = crypto.RIPEMD160.digest
export const secp256k1 = crypto.secp256k1
export const randomBytes = crypto.random.randomBytes
export const privateKey = hd.PrivateKey
export { KeyRing }