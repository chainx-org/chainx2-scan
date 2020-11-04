import React from 'react'
import classnames from 'classnames'
import $t from '@src/locale'

export default function TxAction(props) {
  const { module, call, className, style } = props

  return (
    <div className={classnames(className)} style={style}>
      {`
      ${module ? `${$t(module) || (module)}`: ''}
      ${module && call ? '-' : ''}
      ${call ? `${$t(call) || (call)}` : ''}
      `}</div>
  )
}
