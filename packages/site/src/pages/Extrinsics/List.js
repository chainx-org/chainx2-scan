import React, { useState } from 'react'
import api from '../../services/api'
import { Table } from '../../components'
import $t from '../../locale'
import DateShow from '../../components/DateShow'
import TxLink from '../../components/TxLink'
import BlockLink from '../../components/BlockLink'
import TxAction from '../../components/TxAction'
import { useLoad } from '../../utils/hooks'

export default function() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const { items: extrinsics, loading, total } = useLoad(
    api.fetchExtrinsics,
    page,
    pageSize
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
        console.log(data)
        return (
          <div>
            <pre style={{ textAlign: 'left' }}>
              {JSON.stringify(data.args, null, 2)}
            </pre>
          </div>
        )
      }}
      dataSource={extrinsics.map(item => {
        return {
          key: item.hash,
          hash: (
            <TxLink
              style={{ width: 136 }}
              className="text-truncate"
              value={item.hash}
            />
          ),
          blockHeight: <BlockLink value={item.indexer.blockHeight} />,
          blockTime: <DateShow value={item.indexer.blockTime} />,
          action: <TxAction module={item.section} call={item.name} />,
          args: item.args
        }
      })}
      columns={[
        {
          title: $t('ex_hash'),
          dataIndex: 'hash'
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
          title: $t('ex_action'),
          dataIndex: 'action'
        }
      ]}
    />
  )
}
