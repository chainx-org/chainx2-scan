import React, { useState } from 'react'
import api from '../../services/api'
import { Table } from '../../components'
import $t from '../../locale'
import DateShow from '../../components/DateShow'
import BlockLink from '../../components/BlockLink'
import { useLoad } from '../../utils/hooks'

export default function() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const { items: blocks, loading, total } = useLoad(
    api.fetchBlocks,
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
      dataSource={blocks.map(item => {
        return {
          number: <BlockLink value={item.header.number} />,
          hash: (
            <BlockLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.hash}
            />
          ),
          timestamp: <DateShow value={item.blockTime} />,
          extrinsicNum: (item.extrinsics || []).length,
          key: item.hash
        }
      })}
      columns={[
        {
          title: $t('block_height'),
          dataIndex: 'number'
        },
        {
          title: $t('block_hash'),
          dataIndex: 'hash'
        },
        {
          title: $t('block_time'),
          dataIndex: 'timestamp'
        },
        {
          title: $t('block_extrinsic_num'),
          dataIndex: 'extrinsicNum'
        }
      ]}
    />
  )
}
