import React, { memo } from 'react'
import { useAppContext } from './AppContext'

function zeroSmoke(value) {
  const str = value.toString()
  const Reg = new RegExp(/0{4,}$/)
  if (Reg.test(str)) {
    return (
      <>
        {str.replace(Reg, '')}
        <span className="opacity4">{str.match(Reg)[0]}</span>
      </>
    )
  } else {
    return value
  }
}

function numberToAmount(
  number,
  {
    symbol = '',
    minDigits,
    hideSymbol = false,
    precision = 0,
    unsetDigits = false,
    useGrouping = true
  } = {}
) {
  if (number === null || number === undefined) return ''
  if (isNaN(number)) {
    throw new Error(`expect number but received ${number}`)
  }
  const options = {}

  if (!unsetDigits) {
    if (minDigits !== undefined) {
      options.minimumFractionDigits = minDigits
      options.maximumFractionDigits = minDigits
    } else {
      options.minimumFractionDigits = precision
    }
  }

  options.useGrouping = useGrouping

  const value = new Intl.NumberFormat(undefined, options).format(
    number / Math.pow(10, precision)
  )
  if (!hideSymbol && symbol) {
    return (
      <>
        {zeroSmoke(value)} {symbol}
      </>
    )
  }

  return <>{zeroSmoke(value)}</>
}

export default memo(function Amount(props) {
  const {
    value,
    precision,
    minDigits,
    symbol = 'PCX',
    hideSymbol = false,
    unsetDigits = false,
    useGrouping = true
  } = props
  const tokens = [
    {
      token: 'SDOT',
      token_name: 'Shadow DOT',
      chain: 'Ethereum',
      precision: 3,
      des: 'ChainX s Shadow Polkadot from Ethereum',
      ok: true,
      num: 0
    },
    {
      token: 'PCX',
      token_name: 'Polkadot ChainX',
      chain: 'ChainX',
      precision: 8,
      des: 'ChainX s crypto currency in Polkadot ecology',
      ok: true,
      num: 0
    },
    {
      token: 'L-BTC',
      token_name: 'Lock-up BTC',
      chain: 'Bitcoin',
      precision: 8,
      des: 'ChainX s lock-up Bitcoin',
      ok: true,
      num: 2169035
    },
    {
      token: 'BTC',
      token_name: 'Interchain BTC',
      chain: 'Bitcoin',
      precision: 8,
      des: 'ChainX s interchain Bitcoin',
      ok: true,
      num: 0
    }
  ]

  let tokenPrecision = precision
  if (tokenPrecision === undefined) {
    if (!tokens.length) return null
    const findToken = tokens.find(
      token =>
        token.token === symbol.toUpperCase() ||
        token.token_name === symbol.toUpperCase()
    )
    if (findToken) {
      tokenPrecision = findToken.precision
    }
  }

  return numberToAmount(value, {
    symbol,
    hideSymbol,
    precision: tokenPrecision,
    unsetDigits,
    useGrouping,
    minDigits
  })
})
