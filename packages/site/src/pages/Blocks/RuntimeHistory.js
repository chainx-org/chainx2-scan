import React, { useMemo, useState, useEffect } from 'react'
import api from '../../services/api'
import { Table } from '../../components'
import $t from '../../locale'
import DateShow from '../../components/DateShow'
import TxLink from '../../components/TxLink'
import BlockLink from '../../components/BlockLink'
import TxAction from '../../components/TxAction'
import Success from '@components/Success'
import Fail from '@components/Fail'
import AccountLink from '../../components/AccountLink'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchRuntimeHistory,
  runtimeSelector
} from '../../store/reducers/accountSlice'

export default function({ blockHeight }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    dispatch(fetchRuntimeHistory(setLoading, page, pageSize))
  }, [dispatch, page, pageSize])

  const { info = [], total } = useSelector(runtimeSelector) || {}
  console.log('runtime', info)

  const width = document.documentElement.clientWidth
  const simple = width < 1024

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
      /*
            expandedRowRender={data => {
                return (
                    <div style={{ textAlign: 'left' }}>
                        <h3>Args:</h3>
                        <pre>{JSON.stringify(data.args, null, 2)}</pre>
                    </div>
                )
            }}
            */
      dataSource={info.map((item, idx) => {
        return {
          key: idx,
          hash: (
            <TxLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.hash}
            />
          ),
          signer: (
            <AccountLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.signer}
            />
          ),
          blockHeight: <BlockLink value={item.indexer.blockHeight} />,
          blockTime: <DateShow value={item.indexer.blockTime} />,
          action: <TxAction module={'CodeUpdated'} />,
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
          title: $t('ex_hash'),
          dataIndex: 'hash'
        },
        {
          title: $t('ex_signer'),
          dataIndex: 'signer'
        },
        {
          title: $t('ex_action'),
          dataIndex: 'action'
        },
        {
          title: $t('common_result'),
          dataIndex: 'status'
        }
      ]}
    />
  )
}
