import React, { useMemo, useState } from 'react'
import api from '../../../services/api'
import { Table } from '../../../components'
import $t from '../../../locale'
import DateShow from '../../../components/DateShow'
import TxLink from '../../../components/TxLink'
import BlockLink from '../../../components/BlockLink'
import TxAction from '../../../components/TxAction'
import { useLoad } from '../../../utils/hooks'

export default function({ blockHeight }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const params = useMemo(() => {
    return blockHeight
      ? { block: blockHeight, page, pageSize }
      : { page, pageSize }
  }, [blockHeight, page, pageSize])

  const { items: extrinsics, loading, total } = useLoad(
    api.fetchBlockEvents,
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
            <pre style={{ textAlign: 'right' }}>
              {'args:' + JSON.stringify(data.args, null, 0)}
              {',data: ' + JSON.stringify(data.data)}
            </pre>
          </div>
        )
      }}
      dataSource={extrinsics.map(item => {
        return {
          key: item.extrinsicHash,
          extrinsicHash: (
            <TxLink
              style={{ width: 136 }}
              className="text-truncate"
              value={item.extrinsicHash}
            />
          ),
          blockHeight: <BlockLink value={item.indexer.blockHeight} />,
          blockTime: <DateShow value={item.indexer.blockTime} />,
          action: <TxAction module={item.section} call={item.name} />,
          number: item.phase.value,
          method: $t(item.method),
          type: $t(item.phase.type),
          args: item.meta.args,
          data: item.data
        }
      })}
      columns={[
        {
          title: $t('event_number'),
          dataIndex: 'number'
        },
        {
          title: $t('ex_hash'),
          dataIndex: 'extrinsicHash'
        },
        {
          title: $t('stage'),
          dataIndex: 'type'
        },
        {
          title: $t('kind'),
          dataIndex: 'method'
        }
      ]}
    />
  )
}
