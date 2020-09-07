import React, { useMemo, useState } from 'react'
import api from '../../../services/api'
import { Table } from '../../../components'
import $t from '../../../locale'
import DateShow from '../../../components/DateShow'
import AccountLink from '../../../components/AccountLink'
import TxLink from '../../../components/TxLink'
import BlockLink from '../../../components/BlockLink'
import { useLoad } from '../../../utils/hooks'

export default function({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const params = useMemo(() => {
    return address ? { address: address, page, pageSize } : { page, pageSize }
  }, [address, page, pageSize])

  const { items: transferList, loading, total } = useLoad(
    api.fetchTransfer,
    params
  )

  return (
    <Table
      loading={loading}
      onChange={({ current, pageSize: size }) => {
        setPage(current)
        setPageSize(size)
      }}
      pagination={{ current: page, pageSize, total }}
      expandedRowRender={data => {
        return (
          <div>
            <pre style={{ textAlign: 'left' }}>
              {JSON.stringify(data.args, null, 2)}
            </pre>
          </div>
        )
      }}
      dataSource={transferList.map(item => {
        return {
          key: item.hash,
          hash: (
            <TxLink
              style={{ width: 136 }}
              className="text-truncate"
              value={item.hash}
            />
          ),
          blockHeight: <BlockLink value={item.blockHeight} />,
          blockTime: <DateShow value={item.blockTime} />,
          sender: (
            <AccountLink
              style={{ width: 136 }}
              className="text-truncate"
              value={item.sender}
            />
          ),
          receiver: (
            <AccountLink
              style={{ width: 136 }}
              className="text-truncate"
              value={item.receiver}
            />
          ),
          value: item.value,
          memo: item.memo
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
        },
        {
          title: '备注',
          dataIndex: 'memo'
        }
      ]}
    />
  )
}
