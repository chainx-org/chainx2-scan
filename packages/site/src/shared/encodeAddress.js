import { encodeAddress, setSS58Format } from '@polkadot/keyring'
import hexAddPrefix from '@polkadot/util/hex/addPrefix'

setSS58Format(process.env.REACT_APP_ENV === 'test' ? 42 : 44)

export default function _encodeAddress(publicKey) {
  if (!publicKey) return publicKey
  return encodeAddress(hexAddPrefix(publicKey))
}
