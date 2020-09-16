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

export default function({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchTransfers(address, { page: page - 1, pageSize }, setLoading))
  }, [address, page, pageSize, dispatch])

  const { items: transfers = [], total = 0 } =
    useSelector(transfersSelector) || {}

  return (
    <Table
      loading={loading}
      onChange={({ current, pageSize: size }) => {
        setPage(current)
        setPageSize(size)
      }}
      pagination={{ current: page, pageSize, total }}
      dataSource={transfers.map(item => {
        return {
          key: item.extrinsicHash,
          token: item.token,
          hash: (
            <TxLink
              style={{ width: 136 }}
              className="text-truncate"
              value={item.extrinsicHash}
            />
          ),
          blockHeight: <BlockLink value={item.indexer.blockHeight} />,
          blockTime: <DateShow value={item.indexer.blockTime} />,
          sender: (
            <AccountLink
              style={{ width: 136 }}
              className="text-truncate"
              value={item.from}
            />
          ),
          receiver: (
            <AccountLink
              style={{ width: 136 }}
              className="text-truncate"
              value={item.to}
            />
          ),
          value: <Amount value={item.value} symbol={item.token} />
        }
      })}
      columns={[
        {
          title: $t('ASSETNAME'),
          dataIndex: 'token'
        },
        {
          title: $t('block_height'),
          dataIndex: 'blockHeight'
        },
        {
          title: $t('block_time'),
          dataIndex: 'blockTime'
        },
        {
          title: $t('ex_hash'),
          dataIndex: 'hash'
        },
        {
          title: '发送人',
          dataIndex: 'sender'
        },
        {
          title: '接收人',
          dataIndex: 'receiver'
        },
        {
          title: '金额',
          dataIndex: 'value'
        }
      ]}
    />
  )
}
