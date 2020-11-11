import React from 'react'
import $t from '@src/locale'

export default function TxType(props) {
  const { value } = props

  if (value === 'Withdrawal') {
    return <div>{$t('withdrawal')}</div>
  } else if (value === 'Deposit') {
    return (
      <div style={{ whiteSpace: 'nowrap', width: 58 }}>{$t('deposit')}</div>
    )
  } else if (value === 'HotAndCold') {
    return <div>{$t('hot_and_cold_swap')}</div>
  } else if (value === 'TrusteeTransition') {
    return <div>{$t('trustee_transition')}</div>
  } else if (value === 'Irrelevance') {
    return <div>{$t('irrelevance')}</div>
  } else {
    return <div>{value}</div>
  }
}
