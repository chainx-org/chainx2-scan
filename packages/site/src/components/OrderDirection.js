import React, { memo } from 'react'

const colorMap = {
  SELL: '#EA754B',
  BUY: '#34C69A'
}

export default memo(function OrderDirection(props) {
  const { value } = props
  if (!value || typeof value !== 'string') return ''

  return <div style={{ color: colorMap[value.toUpperCase()] }}>{value}</div>
})
