import React, { useEffect, useState } from 'react'
import { Table } from '../../../components'
import $t from '../../../locale'
import DateShow from '../../../components/DateShow'
import TxLink from '../../../components/TxLink'
import TxAction from '../../../components/TxAction'
import BlockLink from '../../../components/BlockLink'
import {
  extrinsicsSelector,
  fetchExtrinsics
} from '@src/store/reducers/accountSlice'
import { useDispatch, useSelector } from 'react-redux'
import Fail from '@components/Fail'
import Success from '@components/Success'
import AccountLink from '../../../components/AccountLink'

export default function({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchExtrinsics(address, page - 1, pageSize, setLoading))
  }, [address, page, pageSize, dispatch])

  const { items: extrinsics, total } = useSelector(extrinsicsSelector) || {}

  const width = document.documentElement.clientWidth
  const simple = width < 1024

  return (
    <Table
      loading={loading}
      onChange={({ current, pageSize: size }) => {
        setPage(current)
        setPageSize(size)
      }}
      scroll={{
        x: '100vh'
      }}
      pagination={{ current: page, pageSize, total, simple }}
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
              style={{ width: 138 }}
              className="text-truncate"
              value={item.hash}
            />
          ),
          signer:
            item.signer === address ? (
              <div>{item.signer}</div>
            ) : (
              <AccountLink
                style={{ width: 138 }}
                className="text-truncate"
                value={item.signer}
              />
            ),
          blockHeight: <BlockLink value={item.indexer.blockHeight} />,
          blockTime: <DateShow value={item.indexer.blockTime} />,
          section: item.section,
          operation: <TxAction module={item.section} call={item.name} />,
          args: item.args,
          status: item.isSuccess ? <Success /> : <Fail />
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
          title: $t('ex_signer'),
          dataIndex: 'signer'
        },
        {
          title: $t('ex_hash'),
          dataIndex: 'hash'
        },
        {
          title: $t('common_operation'),
          dataIndex: 'operation'
        },
        {
          title: $t('common_result'),
          dataIndex: 'status'
        }
      ]}
    />
  )
}
