import React, { useEffect, useState } from 'react'
import { Table } from '../../../components'
import $t from '../../../locale'
import { useDispatch, useSelector } from 'react-redux'
import {
  BlockNumSelector,
  fetchblockNum,
  fetchUnitMissed,
  UnitMiseedSelector
} from '../../../store/reducers/validatorsSlice'
import TxLink from '../../../components/TxLink'
import BlockLink from '../../../components/BlockLink'
import DateShow from '../../../components/DateShow'
import AccountLink from '../../../components/AccountLink'
import Amount from '../../../components/Amount'
import api from '../../../services/api'

export default function({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    dispatch(fetchUnitMissed(setLoading, address, page - 1, pageSize))
  }, [dispatch, address, page - 1, pageSize])

  const { items = [], total } = useSelector(UnitMiseedSelector) || {}
  const width = document.documentElement.clientWidth
  const simple = width < 1024
  return (
    <Table
      loading={loading}
      onChange={({ current, pageSize: size }) => {
        setPage(current)
        setPageSize(size)
      }}
      pagination={{ current: page, pageSize, simple, total }}
      scroll={{
        x: '100vh'
      }}
      dataSource={items.map(item => {
        return {
          key: item._id,
          blockTime: <DateShow value={item.indexer.blockTime} />,
          blockHeight: item.indexer.blockHeight,
          slashAmount: (
            <Amount value={item.data[1]} precision={8} symbol={'PCX'} />
          ),
          sessionNumber: <div>{item.session}</div>
        }
      })}
      columns={[
        {
          title: $t('block_height'),
          dataIndex: 'blockHeight'
        },
        {
          title: $t('block_time'),
          dataIndex: 'blockTime'
        },
        {
          title: $t('session_number'),
          dataIndex: 'sessionNumber'
        },
        {
          title: $t('slash_amount'),
          dataIndex: 'slashAmount'
        }
      ]}
    />
  )
}
