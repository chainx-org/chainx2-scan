import React, { useEffect, useState } from 'react'
import { Table } from '../../../components'
import $t from '../../../locale'
import DateShow from '../../../components/DateShow'
import TxLink from '../../../components/TxLink'
import BlockLink from '../../../components/BlockLink'
import AccountLink from '../../../components/AccountLink'
import Amount from '../../../components/Amount'
import ExternalLink from '../../../components/ExternalLink'
import {
  withdrawalsSelector,
  fetchWithdrawals
} from '@src/store/reducers/accountSlice'
import { useDispatch, useSelector } from 'react-redux'
import Fail from '@components/Fail'
import Success from '@components/Success'

export default function({ address }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchWithdrawals(address, setLoading, page - 1, pageSize))
  }, [address, dispatch, page, pageSize])

  const { items = [], total } = useSelector(withdrawalsSelector) || {}

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
      dataSource={(items || []).map(item => {
        return {
          key: item._id,
          withdrawal_id: item.data[0],
          btc_withdraw_address: (
            <ExternalLink type="btcAddress" value={item.data[1].addr} />
          ),
          tx_balance: (
            <Amount
              value={item.data[1].balance}
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
              value={item.data[1].applicant}
            />
          ) : (
            ''
          ),
          asset_type: 'BTC',
          chainx_time: <DateShow value={item.indexer.blockTime} />,
          state: item.withdrawState

          /*
          section: item.section,
          operation: `${item.section}(${item.method})`,
          args: item.args,
          status: item.isSuccess ? <Success /> : <Fail />
          */
        }
      })}
      columns={[
        {
          title: $t('withdrawal_id'),
          dataIndex: 'withdrawal_id'
        },
        {
          title: $t('chainx_ex_hash'),
          dataIndex: 'chainx_ex_hash'
        },
        {
          title: $t('chainx_withdraw_account_id'),
          dataIndex: 'chainx_account_id'
        },
        {
          title: $t('btc_withdraw_address'),
          dataIndex: 'btc_withdraw_address'
        },
        {
          title: $t('chainx_withdraw_created_time'),
          dataIndex: 'chainx_time'
        },
        {
          title: $t('cross_withdraw_asset'),
          dataIndex: 'asset_type'
        },
        {
          title: $t('tx_balance'),
          dataIndex: 'tx_balance'
        }
        /*
        {
          title: $t('withdraw_state'),
          dataIndex: 'state'
        }
        */
      ]}
    />
  )
}
