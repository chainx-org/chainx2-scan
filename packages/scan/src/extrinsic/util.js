function isTransferExtrinsic(section, methodName) {
  return (
    (section === 'balances' && methodName === 'transfer') ||
    (section === 'xassets' && methodName === 'transfer')
  )
}

module.exports = {
  isTransferExtrinsic
}
