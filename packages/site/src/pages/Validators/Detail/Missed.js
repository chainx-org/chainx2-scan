import React, { useEffect, useState } from 'react'
import { Table } from '../../../components'
import $t from '../../../locale'
import DateShow from '../../../components/DateShow'
import AccountLink from '../../../components/AccountLink'
import TxLink from '../../../components/TxLink'
import BlockLink from '../../../components/BlockLink'
import Amount from '../../../components/Amount'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTransfers,
  transfersSelector
} from '@src/store/reducers/accountSlice'
import {
  fetchMissed,
  MissedSelector
} from '../../../store/reducers/validatorsSlice'

export default function({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchTransfers(address, { page: page - 1, pageSize }, setLoading))
  }, [address, page, pageSize, dispatch])
  useEffect(() => {
    dispatch(fetchMissed(setLoading, page - 1, pageSize))
  }, [dispatch, page, pageSize])

  const { items = [] } = useSelector(MissedSelector) || {}
  console.log(items)
  let missed = 0
  for (let i = 0; i < items.length; i++) {
    if (items[i].account === address) {
      missed = items[i].missed
    }
  }
  const { items: transfers = [], total = 0 } =
    useSelector(transfersSelector) || {}
  const width = document.documentElement.clientWidth
  const simple = width < 1024
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
      dataSource={transfers.map(item => {
        return {
          key: item.extrinsicHash
        }
      })}
      columns={[
        // {
        //     title: $t('session_index'),
        //     dataIndex: 'token'
        // },
        {
          title: $t('missed_block_sum'),
          dataIndex: missed
        }
      ]}
    />
  )
}
