import React from 'react'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'

import hexAddPrefix from '@polkadot/util/hex/addPrefix'
import { FormattedMessage } from 'react-intl'

export default function VilidatorLink({
  value,
  name = false,
  isActive = true,
  style,
  index = '',
  className,
  filter = 'detail'
}) {
  const hexValue = value

  if (name === null) {
    name = ''
  } else if (!name) {
    const [{ intentions = [] }] = {}
    const intention = intentions.find(
      ({ accountid }) => accountid === hexValue
    ) || { name: '' }
    name = intention.name
  }

  return (
    <NavLink
      to={`/accounts/${hexValue || value}`}
      style={style}
      className={classnames('nav-link', className)}
    >
      {name}
    </NavLink>
  )
}
