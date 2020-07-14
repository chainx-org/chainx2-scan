import React, { memo } from 'react'
import classnames from 'classnames'
import dayjs from 'dayjs'

export default memo(function DateShow(props) {
  const { value, className, style, format = 'YYYY-MM-DD HH:mm:ss' } = props

  return (
    <div style={style} className={classnames(className)}>
      {value ? dayjs(value).format(format) : value}
    </div>
  )
})
