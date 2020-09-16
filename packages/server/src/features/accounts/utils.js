const { getDb } = require('../../services/mongo')
const { encodeAddress } = require('@polkadot/keyring')
const { hexAddPrefix } = require('@polkadot/util')

function _encodeAddress(publicKey) {
  if (!publicKey) return publicKey
  return encodeAddress(hexAddPrefix(publicKey))
}

const emptyAsset = {
  free: '0',
  reserved: '0',
  miscFrozen: '0',
  feeFrozen: '0',
  stakingReserved: {
    bonded: '0',
    bondedWithdrawal: '0'
  }
}

async function getNativeAsset(address) {
  const db = await getDb()
  const col = await db.collection('nativeAsset')
  const [asset] = await col
    .find({ address })
    .sort({ blockHeight: -1 })
    .limit(1)
    .toArray()

  return (
    asset || {
      address,
      ...emptyAsset
    }
  )
}

async function getExtrinsicCount(address) {
  const db = await getDb()
  const col = await db.collection('extrinsic')
  return await col.count({ signer: address })
}

module.exports = {
  getNativeAsset,
  getExtrinsicCount,
  encodeAddress: _encodeAddress
}
