import React, { useMemo, useState } from 'react'
import api from '../../services/api'
import { CommonLink, Table } from '../../components'
import $t from '../../locale'
import DateShow from '../../components/DateShow'
import BlockLink from '../../components/BlockLink'
import TxLink from '../../components/TxLink'
import { useLoad } from '../../utils/hooks'

export default function() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const params = useMemo(() => {
    return { page, pageSize }
  }, [page, pageSize])

  const { items: events, loading, total } = useLoad(api.fetchEvents, params)

  return (
    <Table
      loading={loading}
      onChange={({ current, pageSize: size }) => {
        console.log('current', current)
        setPage(current)
        setPageSize(size)
      }}
      pagination={{ current: page, pageSize, total }}
      dataSource={events.map(item => {
        const {
          indexer: { blockHeight, blockTime },
          extrinsicHash,
          section,
          method,
          index
        } = item
        const id = `${blockHeight}-${index}`
        return {
          id: <CommonLink value={id} link={`/events/${id}`} />,
          blockHeight: <BlockLink value={blockHeight} />,
          blockTime: <DateShow value={blockTime} />,
          index,
          method,
          extrinsicHash: (
            <TxLink
              style={{ width: 136 }}
              className="text-truncate"
              value={extrinsicHash}
            />
          ),
          section,
          key: id
        }
      })}
      columns={[
        {
          title: $t('event_id'),
          dataIndex: 'id'
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
          title: $t('event_extrinsic'),
          dataIndex: 'extrinsicHash'
        },
        {
          title: $t('common_module'),
          dataIndex: 'section'
        },
        {
          title: $t('event_method'),
          dataIndex: 'method'
        }
      ]}
    />
  )
}
