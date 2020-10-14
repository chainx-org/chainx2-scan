import React, { memo } from 'react'
import classnames from 'classnames'

import hexAddPrefix from '@polkadot/util/hex/addPrefix'

export default memo(function Hash(props) {
  const { value, className, style } = props

  if (!value) return null

  const hash = hexAddPrefix(value)

  return (
    <div className={classnames(className)} style={style}>
      {hash}
    </div>
  )
})
