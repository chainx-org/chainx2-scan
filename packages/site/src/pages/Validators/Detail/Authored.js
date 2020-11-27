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
  fetchNodeBlock,
  NodeblockSelector
} from '../../../store/reducers/validatorsSlice'

export default function({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchNodeBlock(setLoading, address, page, pageSize))
  }, [address, page, pageSize, dispatch])

  const { items, total } = useSelector(NodeblockSelector) || {}
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
      dataSource={items.map(item => {
        return {
          key: item._id,
          blockHash: (
            <BlockLink
              style={{ width: 136 }}
              className="text-truncate"
              value={item.hash}
            />
          ),
          blockHeight: <BlockLink value={item.header.number} />,
          blockTime: <DateShow value={item.blockTime} />
        }
      })}
      columns={[
        {
          title: $t('block_height'),
          dataIndex: 'blockHeight'
        },
        {
          title: $t('block_hash'),
          dataIndex: 'blockHash'
        },
        {
          title: $t('block_time'),
          dataIndex: 'blockTime'
        }
      ]}
    />
  )
}
