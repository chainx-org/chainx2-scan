import { ReactComponent as SuccessIcon } from '../assets/success.svg'
import React from 'react'
import $t from '@src/locale'

export default function Success() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}
    >
      <SuccessIcon style={{ marginRight: 4, height: '1.2em' }} />
      <span>{$t('common_success')}</span>
    </div>
  )
}
