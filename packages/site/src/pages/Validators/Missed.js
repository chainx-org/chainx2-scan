import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '@components/Table'

import $t from '@src/locale'

import AccountLink from '../../components/AccountLink'
import {
  fetchMissed,
  MissedSelector
} from '../../store/reducers/validatorsSlice'

export default function() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)

  const width = document.documentElement.clientWidth
  const simple = width < 1024

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchMissed(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])

  const { items = [], total } = useSelector(MissedSelector) || {}
  return (
    <Table
      loading={loading}
      onChange={({ current, pageSize: size }) => {
        setPage(current)
        setPageSize(size)
      }}
      pagination={{ current: page, pageSize, total, simple }}
      scroll={{
        x: '100vh'
      }}
      dataSource={items.map(item => {
        return {
          account_address: (
            <AccountLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.account}
            />
          ),
          referral_id: <div>{item.referralId}</div>,
          missed: <div>{item.missed}</div>
        }
      })}
      columns={[
        {
          title: $t('validator_address'),
          dataIndex: 'account_address'
        },
        {
          title: $t('referral_id'),
          dataIndex: 'referral_id'
        },
        {
          title: $t('missed_block_sum'),
          dataIndex: 'missed'
        }
      ]}
    />
  )
}
