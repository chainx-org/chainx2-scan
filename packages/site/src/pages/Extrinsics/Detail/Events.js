import React from 'react'
import $t from '../../../locale'
import { useLoad } from '../../../utils/hooks'
import api from '../../../services/api'
import Table from '../../../components/Table'
import { CommonLink } from '../../../components'

const { useMemo } = require('react')
const { useState } = require('react')

export default function({ extrinsicHash }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const params = useMemo(
    () => ({ extrinsic_hash: extrinsicHash, page, pageSize }),
    [extrinsicHash, page, pageSize]
  )

  const { items: events, loading, total } = useLoad(
    api.fetchExtrinsicEvents,
    params
  )

  return (
    <div className="box">
      <div className="tabs">
        <ul>
          <li className="is-active">
            <a>{$t('event_list')}</a>
          </li>
        </ul>
      </div>
      <Table
        loading={loading}
        onChange={({ current, pageSize: size }) => {
          setPage(current)
          setPageSize(size)
        }}
        pagination={{ current: page, pageSize, total }}
        expandedRowRender={data => {
          return (
            <div style={{ textAlign: 'left' }}>
              <h3>Meta:</h3>
              <pre>{JSON.stringify(data.meta, null, 2)}</pre>
              <h3>Data:</h3>
              <pre>{JSON.stringify(data.data, null, 2)}</pre>
            </div>
          )
        }}
        dataSource={events.map((item, idx) => {
          const {
            indexer: { blockHeight },
            section,
            method,
            index,
            meta,
            data
          } = item
          const id = `${blockHeight}-${index}`
          return {
            id: <CommonLink value={id} link={`/events/${id}`} />,
            index: <CommonLink value={index} link={`/events/${id}`} />,
            method,
            section,
            meta,
            data,
            key: idx
          }
        })}
        columns={[
          {
            title: $t('event_index'),
            dataIndex: 'index'
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
    </div>
  )
}
