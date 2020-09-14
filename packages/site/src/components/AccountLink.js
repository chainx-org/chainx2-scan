import React from 'react'
import classnames from 'classnames'
import { NavLink } from 'react-router-dom'

export default function Accountlink(props) {
  const { value, hexValue, className, style } = props

  return (
    <NavLink
      to={`/accounts/${hexValue || value}`}
      style={style}
      className={classnames('nav-link', className)}
    >
      {value}
    </NavLink>
  )
}
