import BigNumber from 'bignumber.js'

export default function safeAdd(...items) {
  return items.reduce((result, item) => {
    return new BigNumber(result).plus(item).toString()
  }, 0)
}
