import React, { memo } from 'react'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import hexAddPrefix from '@chainx-v2/util/hex/addPrefix'

import { encodeAddress } from '../shared'

export default memo(function AddressLink(props) {
  const { value, className, style, render = x => x } = props
  const hexValue = hexAddPrefix(value)
  let showValue = ''

  if (hexValue !== '0x') {
    showValue = encodeAddress(hexValue)
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
