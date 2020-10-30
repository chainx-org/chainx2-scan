import React, { useState, useCallback } from 'react'
import api from '../services/api'
import $t from '../locale'
export default function InputSearch(props) {
  const { history } = props

  const [str, setStr] = useState('')

  const search = useCallback(
    async str => {
      const result = await api.search(str)
      if (result.error) {
        alert(result.error.message)
      } else {
        history.push(result.result)
        setStr('')
      }
    },
    [api]
  )
  return (
    <span className="navbar-search">
      <input
        value={str}
        onChange={e => setStr(e.target.value)}
        onKeyPress={event => {
          if (event.key === 'Enter') {
            search(str)
          }
        }}
        style={{ width: 350, paddingRight: 50 }}
        className="input is-rounded"
        type="text"
        placeholder={
          $t('search') +
          '/' +
          $t('block_height') +
          '/' +
          $t('block_hash') +
          '/' +
          $t('ex_hash') +
          '/' +
          $t('address_item')
        }
      />
      <i className="iconfont icon-search search" />
    </span>
  )
}
