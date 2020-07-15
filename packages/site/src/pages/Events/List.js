import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { Table, CommonLink } from '../../components'
import $t from '../../locale'
import DateShow from '../../components/DateShow'
import BlockLink from '../../components/BlockLink'
import TxLink from '../../components/TxLink'

export default function() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    const { promise, cancel } = api.fetchEvents({ page, pageSize })

    promise
      .then(({ result: data }) => {
        setEvents(data.items)
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
