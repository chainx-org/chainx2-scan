const { extractUserTransfer, updateBalance } = require('../account')

async function extractExtrinsicBusinessData(extrinsic, indexer) {
  const section = extrinsic.method.sectionName
  const methodName = extrinsic.method.methodName
  const { args } = extrinsic.method.toJSON()
  const signer = extrinsic._raw.signature.get('signer').toString()

  if (section.toLowerCase() === 'balances' && methodName === 'transfer') {
    await updateBalance(extrinsic, signer, args.dest)
    await extractUserTransfer(extrinsic, indexer, signer, args)
  }
}

module.exports = {
  extractExtrinsicBusinessData
}
