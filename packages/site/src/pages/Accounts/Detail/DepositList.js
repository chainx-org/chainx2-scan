import React, { useEffect, useState } from 'react'
import { Table } from '../../../components'
import $t from '../../../locale'
import DateShow from '../../../components/DateShow'
import TxLink from '../../../components/TxLink'
import BlockLink from '../../../components/BlockLink'
import Amount from '../../../components/Amount'
import ExternalLink from '../../../components/ExternalLink'
import Hash from '../../../components/Hash'
import AccountLink from '../../../components/AccountLink'

import {
  depositsSelector,
  fetchDeposits
} from '@src/store/reducers/accountSlice'
import { useDispatch, useSelector } from 'react-redux'
import Fail from '@components/Fail'
import Success from '@components/Success'
import swapEndian from '../../../utils/swapEndian'

export default function({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchDeposits(address, setLoading, page - 1, pageSize))
  }, [address, dispatch, page, pageSize])

  const { items = [], total } = useSelector(depositsSelector)

  return (
    <Table
      loading={loading}
      onChange={({ current, pageSize: size }) => {
        setPage(current)
        setPageSize(size)
      }}
      pagination={{ current: page, pageSize, total }}
      scroll={{
        x: '100vh'
      }}
      expandedRowRender={data => {
        return (
          <div>
            <pre style={{ textAlign: 'left' }}>
              {JSON.stringify(data.args, null, 2)}
            </pre>
          </div>
        )
      }}
      dataSource={(items || []).map(item => {
        const btcTxHashForExplorer = swapEndian(item.data[0].slice(2))
        return {
          key: item._id,
          btc_tx_hash: (
            <ExternalLink
              type="btcTestnetTxid"
              value={btcTxHashForExplorer}
              render={() => {
                return (
                  <Hash
                    style={{ width: 138 }}
                    className="text-truncate"
                    value={btcTxHashForExplorer}
                  />
                )
              }}
            />
          ),
          // tx_type: <TxType value={item.txType} />,

          tx_balance: (
            <Amount
              value={item.data[2]}
              precision={8}
              symbol={'BTC'}
              hideSymbol
            />
          ),
          chainx_ex_hash: (
            <TxLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.extrinsicHash}
            />
          ),
          chainx_account_id: item.data ? (
            <AccountLink
              style={{ width: 138 }}
              className="text-truncate"
              value={item.data[1]}
            />
          ) : (
            ''
          ),
          asset_type: 'BTC',
          chainx_time: <DateShow value={item.indexer.blockTime} />,
          blockHeight: <BlockLink value={item.indexer.blockHeight} />,
          section: item.section,
          operation: `${item.section}(${item.name})`,
          args: item.args,
          status: item.isSuccess ? <Success /> : <Fail />
        }
      })}
      columns={[
        {
          title: $t('cross_btc_tx_hash'),
          dataIndex: 'btc_tx_hash'
        },
        {
          title: $t('chainx_ex_hash'),
          dataIndex: 'chainx_ex_hash'
        },
        {
          title: $t('chainx_deposit_account_id'),
          dataIndex: 'chainx_account_id'
        },
        {
          title: $t('chainx_deposit_time'),
          dataIndex: 'chainx_time'
        },
        {
          title: $t('cross_deposit_asset'),
          dataIndex: 'asset_type'
        },
        {
          title: $t('tx_balance'),
          dataIndex: 'tx_balance'
        }
      ]}
    />
  )
}
