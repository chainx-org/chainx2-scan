import React from 'react'
import classnames from 'classnames'
import { NavLink } from 'react-router-dom'
import { Empty } from 'antd'

export default function Accountlink(props) {
  const { value, hexValue, className, style } = props

  if (!value)
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        imageStyle={{
          height: 16,
          margin: 0
        }}
        description={false}
      />
    )

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
