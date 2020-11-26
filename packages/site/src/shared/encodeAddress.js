import { encodeAddress, setSS58Format } from '@polkadot/keyring'
import { hexAddPrefix } from '@polkadot/util'
import { Keyring } from '@polkadot/keyring'

const keyring = new Keyring()
// keyring.setSS58Format(process.env.REACT_APP_ENV === 'test' ? 42 : 44)
// 42 for testnet, 44 for mainnet
keyring.setSS58Format(44)

export default function _encodeAddress(publicKey) {
  if (!publicKey) return publicKey
  return keyring.encodeAddress(hexAddPrefix(publicKey))
}
