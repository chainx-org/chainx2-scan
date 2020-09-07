const { extractUserTransfer, updateBalance } = require('../account')
const ignoreSectionNames = ['timestsamp']
const { extractVoteInfo, extractOrder } = require('../account')

async function extractExtrinsicBusinessData(extrinsic, indexer) {
  const hash = extrinsic.hash.toHex()
  const section = extrinsic.method.sectionName.toLowerCase()
  if (ignoreSectionNames.includes(section)) {
    return
  }

  const methodName = extrinsic.method.methodName.toLowerCase()
  const { args } = extrinsic.method.toJSON()
  const signer = extrinsic._raw.signature.get('signer').toString()

  if (section === 'balances' && methodName === 'transfer') {
    await updateBalance(extrinsic, signer, args.dest)
    await extractUserTransfer(extrinsic, indexer, signer, args)
  } else if (section === 'xStaking') {
    // 更新xStaking列表
    await extractVoteInfo(extrinsic, hash, indexer, signer, args)
  } else if (section === 'xSpot') {
    // 更新委托订单
    await extractOrder(extrinsic, hash, indexer, name, signer, args)
  }
}

module.exports = {
  extractExtrinsicBusinessData
}
