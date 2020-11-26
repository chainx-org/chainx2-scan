import { decodeAddress, setSS58Format } from '@polkadot/keyring'
import { u8aToHex } from '@polkadot/util'

import { Keyring } from '@polkadot/keyring'

const keyring = new Keyring()
// keyring.setSS58Format(process.env.REACT_APP_ENV === 'test' ? 42 : 44)
// 42 for testnet, 44 for mainnet
keyring.setSS58Format(44)

export default function _decodeAddress(address) {
  if (!address) return address
  return u8aToHex(decodeAddress(address))
}
