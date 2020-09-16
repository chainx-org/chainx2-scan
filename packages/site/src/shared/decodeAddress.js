import { decodeAddress, setSS58Format } from '@polkadot/keyring'
import { u8aToHex } from '@polkadot/util'

setSS58Format(process.env.REACT_APP_ENV === 'test' ? 42 : 44)

export default function _decodeAddress(address) {
  if (!address) return address
  return u8aToHex(decodeAddress(address))
}
