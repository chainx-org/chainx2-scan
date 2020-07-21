const httpUtils = require('./http')

function ensure0xPrefix(str = '') {
  if (!str.startsWith('0x')) {
    return `0x${str}`
  }
  return str
}

function isHash(str = '') {
  const normalized = ensure0xPrefix(str)
  return /^(0x)?[\da-fA-F]{64}$/.test(normalized)
}

function isNum(str = null) {
  return str !== null && /\d+/.test(str)
}

function isMongoId(str = '') {
  return /^[\da-fA-F]{24}$/.test(str)
}

module.exports = {
  isMongoId,
  isHash,
  isNum,
  ensure0xPrefix,
  ...httpUtils
}
