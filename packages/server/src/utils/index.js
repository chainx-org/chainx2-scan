const httpUtils = require('./http')
const BigNumber = require('bignumber.js')
const mongoUtils = require('./aggregate-wrapper')

const {
  decodeAddress,
  encodeAddress,
  setSS58Format
} = require('@polkadot/keyring')
const { hexAddPrefix, u8aToHex } = require('@polkadot/util')

const { Keyring } = require('@polkadot/keyring')

const keyring = new Keyring()
// keyring.setSS58Format(process.env.REACT_APP_ENV === 'test' ? 42 : 44)
// 42 for testnet, 44 for mainnet
keyring.setSS58Format(44)
const ss58format = 44
setSS58Format(44)

function _encodeAddress(publicKey) {
  if (!publicKey) return publicKey
  return encodeAddress(hexAddPrefix(publicKey), ss58format)
}

function _decodeAddress(address) {
  if (!address) return address
  return u8aToHex(decodeAddress(address, ss58format))
}

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

function safeAdd(...items) {
  return items.reduce((result, item) => {
    return new BigNumber(result).plus(item).toString()
  }, 0)
}

module.exports = {
  isMongoId,
  isHash,
  isNum,
  ensure0xPrefix,
  safeAdd,
  encodeAddress: _encodeAddress,
  decodeAddress: _decodeAddress,
  ...httpUtils,
  ...mongoUtils
}
