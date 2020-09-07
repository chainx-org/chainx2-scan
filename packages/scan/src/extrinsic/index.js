const { extractUserTransfer, updateBalance } = require('../account')
const ignoreSectionNames = ['timestsamp']

async function extractExtrinsicBusinessData(extrinsic, indexer) {
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
  }
}

module.exports = {
  extractExtrinsicBusinessData
}
