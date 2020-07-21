import React from 'react'
import classnames from 'classnames'
import { NavLink } from 'react-router-dom'

export default function CommonLink(props) {
  const { value, link, className, style } = props
  if (typeof value === 'undefined' || value === null) return null

  return (
    <NavLink
      to={link}
      className={classnames('nav-link', className)}
      style={style}
    >
      {value}
    </NavLink>
  )
}
