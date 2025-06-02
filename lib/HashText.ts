import * as Crypto from "expo-crypto"

export default async function hashTextToSha256(text: string): Promise<string> {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text, {
    encoding: Crypto.CryptoEncoding.HEX,
  })
}
