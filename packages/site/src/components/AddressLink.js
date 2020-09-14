import React, { memo } from 'react'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import hexAddPrefix from '@chainx-v2/util/hex/addPrefix'

import { decodeAddress, encodeAddress } from '../shared'

export default memo(function AddressLink(props) {
  const {
    value,
    className,
    style,
    render = x => x,
    short = false,
    length = 5
  } = props
  let showValue = ''
  let hexValue = ''

  const isAddress = !value.startsWith('0x')
  if (isAddress) {
    hexValue = decodeAddress(value)
    showValue = value
  } else {
    hexValue = hexAddPrefix(value)
    if (hexValue !== '0x') {
      showValue = encodeAddress(hexValue)
    }
  }

  if (short && showValue.length > 2 * length) {
    showValue =
      showValue.substring(0, 5) +
      '...' +
      showValue.substring(showValue.length - 5)
  }

  return (
    <NavLink
      to={`/accounts/${hexValue}`}
      style={style}
      className={classnames('nav-link', className)}
    >
      {render(showValue)}
    </NavLink>
  )
})
