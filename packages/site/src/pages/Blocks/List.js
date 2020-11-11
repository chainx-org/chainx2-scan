import React, { useMemo, useState, useEffect, useRef } from 'react'
import { VariableSizeGrid as Grid } from 'react-window'
import ResizeObserver from 'rc-resize-observer'
import classNames from 'classnames'
import api from '../../services/api'
import { Table } from '../../components'
import $t from '../../locale'
import DateShow from '../../components/DateShow'
import BlockLink from '../../components/BlockLink'
import AddressLink from '@components/AddressLink'
import { useLoad } from '../../utils/hooks'

export default function() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const width = document.documentElement.clientWidth
  const simple = width < 1024
  const params = useMemo(() => {
    return { page, pageSize }
  }, [page, pageSize])

  const { items: blocks, loading, total } = useLoad(api.fetchBlocks, params)

  return (
    <Table
      loading={loading}
      onChange={({ current, pageSize: size }) => {
        setPage(current)
        setPageSize(size)
      }}
      pagination={{ current: page, pageSize, total, simple: simple }}
      scroll={{
        x: '100vh'
      }}
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
          author: (
            <AddressLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.author}
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
          title: $t('block_author'),
          dataIndex: 'author'
        },
        {
          title: $t('block_extrinsic_num'),
          dataIndex: 'extrinsicNum'
        }
      ]}
    />
  )
}
