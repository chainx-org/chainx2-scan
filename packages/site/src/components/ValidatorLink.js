import React from 'react'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { Empty } from 'antd'

import hexAddPrefix from '@polkadot/util/hex/addPrefix'
import { FormattedMessage } from 'react-intl'

export default function VilidatorLink({
  value,
  name,
  style,
  className,
  activeKey
}) {
  if (!name)
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
      to={{ pathname: `/validators/detail/${value}`, state: { activeKey } }}
      style={style}
      className={classnames('nav-link', className)}
    >
      {name}
    </NavLink>
  )
}
