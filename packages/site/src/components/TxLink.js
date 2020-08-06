import React from 'react'
import classnames from 'classnames'

import hexAddPrefix from '@chainx-v2/util/hex/addPrefix'
import { NavLink } from 'react-router-dom'

export default function TxLink(props) {
  const { value, className, style } = props

  if (!value) return null

  const hash = hexAddPrefix(value)

  return (
    <NavLink
      to={`/extrinsics/${hash}`}
      className={classnames('nav-link', className)}
      style={style}
    >
      {hash}
    </NavLink>
  )
}
