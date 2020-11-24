const { getDb } = require('../../services/mongo')

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
  return await col.countDocuments({ signer: address })
}

module.exports = {
  getNativeAsset,
  getExtrinsicCount
}
