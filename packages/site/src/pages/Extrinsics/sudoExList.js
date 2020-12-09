import React, { useMemo, useState } from 'react'
import api from '../../services/api'
import { Table } from '../../components'
import $t from '../../locale'
import DateShow from '../../components/DateShow'
import TxLink from '../../components/TxLink'
import BlockLink from '../../components/BlockLink'
import TxAction from '../../components/TxAction'
import { useLoad } from '../../utils/hooks'
import Success from '@components/Success'
import Fail from '@components/Fail'
import AccountLink from '../../components/AccountLink'

export default function({ blockHeight }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const width = document.documentElement.clientWidth
  const simple = width < 1024
  const params = useMemo(() => {
    return blockHeight
      ? { block: blockHeight, page, pageSize }
      : { page, pageSize }
  }, [blockHeight, page, pageSize])

  const { items: extrinsics, loading, total } = useLoad(
    api.fetchSudoExtrinsics,
    params
  )

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
      expandedRowRender={data => {
        return (
          <div>
            <pre style={{ textAlign: 'left' }}>
              CallIndex: {JSON.stringify(data.callIndex, null, 2)}
            </pre>
          </div>
        )
      }}
      dataSource={extrinsics.map((item, idx) => {
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
          action: <TxAction module={item.section} call={item.name} />,
          // args: item.args,
          callIndex: item.args.call.callIndex,
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
