import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { Table } from '../../components'
import $t from '../../locale'
import DateShow from '../../components/DateShow'
import TxLink from '../../components/TxLink'
import BlockLink from '../../components/BlockLink'
import TxAction from '../../components/TxAction'

export default function() {
  const [extrinsics, setExtrinsics] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    const { promise, cancel } = api.fetchExtrinsics({ page, pageSize })

    promise
      .then(({ result: data }) => {
        setExtrinsics(data.items)
        setPage(data.page)
        setPageSize(data.pageSize)
        setTotal(data.total - pageSize)
      })
      .finally(() => {
        setLoading(false)
      })

    return () => cancel()
  }, [page, pageSize])

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
