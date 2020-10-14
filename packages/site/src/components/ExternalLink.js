import React from 'react'
import classnames from 'classnames'

export default function ExternalLink({
  value,
  render,
  type,
  className,
  style
}) {
  let href = ''
  if (!type) {
    type = false
  }
  switch (type) {
    case 'url':
    case false:
      try {
        const url = new URL(`http://${value}`)
        href = url.href
      } catch {}
      break
    case 'btcHash':
      href = `https://live.blockcypher.com/btc/block/${value}/`
      break
    case 'btcTxid':
      href = `https://live.blockcypher.com/btc/tx/${value}/`
      break
    case 'btcAddress':
      href = `https://live.blockcypher.com/btc/address/${value}`
      break
    case 'btcTestnetHash':
      href = `https://live.blockcypher.com/btc-testnet/block/${value}/`
      break
    case 'btcTestnetTxid':
      href = `https://live.blockcypher.com/btc-testnet/tx/${value}/`
      break
    case 'btcTestnetAddress':
      href = `https://live.blockcypher.com/btc-testnet/address/${value}`
      break
    case 'ethAddress':
      href = `https://etherscan.io/address/${value}`
      break
    default:
      break
  }

  return href ? (
    <a
      className={classnames(className, 'nav-link')}
      href={href}
      style={style}
      target="_blank"
      rel="noopener noreferrer"
    >
      {render ? render(value) : value}
    </a>
  ) : (
    value
  )
}
