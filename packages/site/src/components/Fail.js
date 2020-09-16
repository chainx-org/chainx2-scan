import { ReactComponent as ErrorIcon } from '../assets/error.svg'
import React from 'react'
import $t from '@src/locale'

export default function Fail() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}
    >
      <ErrorIcon style={{ marginRight: 4, height: '1.2em' }} />
      <span>{$t('common_fail')}</span>
    </div>
  )
}
