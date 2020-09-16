import React, { useEffect, useState } from 'react'
import { Table } from '../../../components'
import $t from '../../../locale'
import DateShow from '../../../components/DateShow'
import TxLink from '../../../components/TxLink'
import BlockLink from '../../../components/BlockLink'
import {
  extrinsicsSelector,
  fetchExtrinsics
} from '@src/store/reducers/accountSlice'
import { useDispatch, useSelector } from 'react-redux'

export default function({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchExtrinsics(address, setLoading))
  }, [address, dispatch])

  const { items: extrinsics, total } = useSelector(extrinsicsSelector)

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
      dataSource={(extrinsics || []).map(item => {
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
          section: item.section,
          operation: `${item.section}(${item.name})`,
          args: item.args
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
          title: '操作',
          dataIndex: 'operation'
        }
      ]}
    />
  )
}
