import React from 'react'
import classnames from 'classnames'
import { Empty } from 'antd'

import hexAddPrefix from '@polkadot/util/hex/addPrefix'
import { NavLink } from 'react-router-dom'

export default function TxLink(props) {
  const { value, className, style } = props

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
