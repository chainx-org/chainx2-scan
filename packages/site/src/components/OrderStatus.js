import React, { memo } from 'react'

export default memo(function OrderStatus(props) {
  const { value } = props
  if (!value || typeof value !== 'string') return ''

  return <div>{value}</div>
})
