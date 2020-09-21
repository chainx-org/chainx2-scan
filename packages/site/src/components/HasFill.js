import React, { memo } from 'react'
import { NumberFormat, Amount } from '.'

export default memo(function HasFill(props) {
  const { fill, total, symbol } = props

  return (
    <span>
      <Amount value={fill} symbol={symbol} hideSymbol />
      (
      <NumberFormat
        value={fill / total}
        options={{ style: 'percent', minimumFractionDigits: 1 }}
      />
      )
    </span>
  )
})
