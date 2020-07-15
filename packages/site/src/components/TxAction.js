import React from 'react'
import classnames from 'classnames'

export default function TxAction(props) {
  const { module, call, className, style } = props

  return (
    <div className={classnames(className)} style={style}>{`${module}${
      call ? `(${call})` : ''
    }`}</div>
  )
}
