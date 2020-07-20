import { memo } from 'react'

export default memo(function NumberFormat(props) {
  const { value, options } = props
  if (isNaN(value)) return ''

  return new Intl.NumberFormat(undefined, {
    useGrouping: true,
    ...options
  }).format(value)
})
